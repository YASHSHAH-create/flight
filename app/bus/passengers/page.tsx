'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, Wallet } from 'lucide-react';
import BusShell from '@/app/components/bus/BusShell';
import Steps from '@/app/components/bus/Steps';
import { useSession } from '@/context/SessionContext';
import { api, ApiError, draftStore, fmtDate, fmtINR, fmtTime } from '@/app/lib/bus/client';
import type { BusDraft, CheckoutResponse, PassengerInput } from '@/app/lib/bus/types';

type PaxForm = { title: 'Mr' | 'Mrs' | 'Ms'; firstName: string; lastName: string; age: string; gender: 1 | 2 };
const emptyPax = (): PaxForm => ({ title: 'Mr', firstName: '', lastName: '', age: '', gender: 1 });
const ID_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Voter ID', 'Driving Licence'] as const;

const input = 'w-full bg-lav border border-hair rounded-xl px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-brand focus:bg-white transition-colors placeholder:font-normal placeholder:text-ink-3';

function PassengersInner() {
    const router = useRouter();
    const sp = useSearchParams();
    const { user, walletBalance, requireLogin, refresh } = useSession();
    const [draft, setDraft] = useState<BusDraft | null | undefined>(undefined);
    const [pax, setPax] = useState<PaxForm[]>([]);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [idType, setIdType] = useState<(typeof ID_TYPES)[number]>('Aadhaar');
    const [idNumber, setIdNumber] = useState('');
    const [pay, setPay] = useState<'GATEWAY' | 'WALLET'>('GATEWAY');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [fieldErr, setFieldErr] = useState('');

    useEffect(() => {
        const d = draftStore.load();
        if (!d || !d.seats?.length || !d.boarding) { setDraft(null); return; }
        setDraft(d);
        setPax(d.seats.map(() => emptyPax()));
    }, []);

    // Back from Google sign-in: exchange the site session for a Paymm login.
    useEffect(() => {
        if (sp.get('glogin') === '1' || sp.get('token')) {
            fetch('/api/bus-auth/google', { method: 'POST', credentials: 'same-origin' })
                .then(() => refresh())
                .finally(() => router.replace('/bus/passengers'));
        }
    }, [sp, refresh, router]);

    useEffect(() => {
        if (user) {
            if (!email && user.email && !user.email.endsWith('@phone.paymm.in')) setEmail(user.email);
            if (!phone && user.phone) setPhone(user.phone.replace(/^\+?91/, ''));
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const total = useMemo(() => (draft?.seats || []).reduce((s, x) => s + x.fare, 0), [draft]);
    const idRequired = !!draft?.paxIdRequired;
    const walletOk = walletBalance !== null && walletBalance >= total;

    const update = (i: number, patch: Partial<PaxForm>) => setPax((cur) => cur.map((p, j) => (j === i ? { ...p, ...patch } : p)));

    const submit = async () => {
        if (!draft) return;
        setError(''); setFieldErr('');
        for (let i = 0; i < pax.length; i++) {
            const p = pax[i];
            if (!p.firstName.trim() || !p.lastName.trim()) { setFieldErr(`Enter the full name for passenger ${i + 1} (seat ${draft.seats[i].name}).`); return; }
            const age = Number(p.age);
            if (!Number.isInteger(age) || age < 1 || age > 110) { setFieldErr(`Enter a valid age for passenger ${i + 1}.`); return; }
            if (draft.seats[i].ladies && p.gender !== 2) { setFieldErr(`Seat ${draft.seats[i].name} is reserved for women.`); return; }
        }
        if (!/^[6-9]\d{9}$/.test(phone)) { setFieldErr('Enter a valid 10-digit mobile number — your m-ticket is sent here.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email)) { setFieldErr('Enter a valid email for the ticket copy.'); return; }
        if (idRequired && !idNumber.trim()) { setFieldErr('This operator checks a photo ID at boarding — add the lead passenger’s ID number.'); return; }

        const ok = await requireLogin();
        if (!ok) return;

        setBusy(true);
        try {
            const passengers: PassengerInput[] = pax.map((p, i) => ({
                title: p.title, firstName: p.firstName.trim(), lastName: p.lastName.trim(), age: Number(p.age), gender: p.gender, seatName: draft.seats[i].name,
            }));
            const res = await api<CheckoutResponse>('/api/bus/checkout', {
                body: {
                    traceId: draft.traceId, resultIndex: draft.bus.resultIndex, srdvIndex: draft.bus.srdvIndex, date: draft.date,
                    from: draft.from, to: draft.to,
                    bus: { operator: draft.bus.operator, busType: draft.bus.busType, departure: draft.bus.departure, arrival: draft.bus.arrival },
                    boardingPointId: draft.boarding!.id, droppingPointId: draft.dropping?.id || draft.boarding!.id,
                    passengers, contact: { email: email.trim(), phone },
                    idProof: idNumber.trim() ? { type: idType, number: idNumber.trim() } : undefined,
                    payMethod: pay,
                },
            });
            if (res.payMethod === 'GATEWAY' && res.redirectUrl) {
                window.location.href = res.redirectUrl;
                return;
            }
            draftStore.clear();
            router.replace(`/bus/booking/${encodeURIComponent(res.txnid)}`);
        } catch (e) {
            if (e instanceof ApiError && e.status === 401) { await requireLogin(); }
            setError(e instanceof ApiError ? e.message : 'Could not start the payment. Please try again.');
            setBusy(false);
        }
    };

    if (draft === null) {
        return (
            <BusShell>
                <div className="card p-10 text-center">
                    <h1 className="text-xl font-extrabold text-ink mb-2">Nothing to book yet</h1>
                    <p className="text-sm text-ink-2 mb-4">Pick a bus and seats first — seat holds are live, so we cannot keep them across sessions.</p>
                    <Link href="/bus" className="btn-primary">Search buses</Link>
                </div>
            </BusShell>
        );
    }
    if (!draft) return <BusShell><div className="card h-60 shimmer" /></BusShell>;

    return (
        <BusShell wide>
            <div className="flex items-center justify-between gap-4 mb-4">
                <Steps current={3} />
                <button onClick={() => router.back()} className="text-xs font-bold text-brand hover:underline">Change seats</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <section className="lg:col-span-8 space-y-4">
                    {draft.seats.map((seat, i) => (
                        <div key={`${seat.upper ? 'U' : 'L'}${seat.name}`} className="card p-4 md:p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-extrabold text-ink">{i === 0 ? 'Lead passenger' : `Passenger ${i + 1}`}</h2>
                                <span className="pill-soft bg-brand-soft text-brand">Seat {seat.name}{seat.upper ? ' · Upper' : ''} · {fmtINR(seat.fare)}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-4 sm:col-span-2">
                                    <label className="field-label">Title</label>
                                    <select value={pax[i]?.title} onChange={(e) => update(i, { title: e.target.value as PaxForm['title'], gender: e.target.value === 'Mr' ? 1 : 2 })} className={input}>
                                        <option>Mr</option><option>Mrs</option><option>Ms</option>
                                    </select>
                                </div>
                                <div className="col-span-8 sm:col-span-5">
                                    <label className="field-label">First name</label>
                                    <input value={pax[i]?.firstName || ''} onChange={(e) => update(i, { firstName: e.target.value })} placeholder="As on ID" className={input} autoComplete="given-name" />
                                </div>
                                <div className="col-span-12 sm:col-span-5">
                                    <label className="field-label">Last name</label>
                                    <input value={pax[i]?.lastName || ''} onChange={(e) => update(i, { lastName: e.target.value })} placeholder="Surname" className={input} autoComplete="family-name" />
                                </div>
                                <div className="col-span-4 sm:col-span-3">
                                    <label className="field-label">Age</label>
                                    <input value={pax[i]?.age || ''} onChange={(e) => update(i, { age: e.target.value.replace(/\D/g, '').slice(0, 3) })} inputMode="numeric" placeholder="Yrs" className={input} />
                                </div>
                                <div className="col-span-8 sm:col-span-5">
                                    <label className="field-label">Gender</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {([[1, 'Male'], [2, 'Female']] as [1 | 2, string][]).map(([g, l]) => (
                                            <button key={g} type="button" onClick={() => update(i, { gender: g, title: g === 1 ? 'Mr' : pax[i]?.title === 'Mr' ? 'Ms' : pax[i]?.title })}
                                                className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${pax[i]?.gender === g ? 'bg-brand-soft border-brand text-brand' : 'bg-white border-hair text-ink-2 hover:border-brand/40'}`}>{l}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="card p-4 md:p-5">
                        <h2 className="font-extrabold text-ink mb-3">Contact details</h2>
                        <p className="text-xs text-ink-2 mb-3">Your m-ticket is sent on WhatsApp/SMS to this number and a copy to this email.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="field-label">Mobile number</label>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-2.5 rounded-xl bg-lav border border-hair text-sm font-bold text-ink-2">+91</span>
                                    <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="98765 43210" className={input} autoComplete="tel-national" />
                                </div>
                            </div>
                            <div>
                                <label className="field-label">Email</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className={input} autoComplete="email" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 md:p-5">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="font-extrabold text-ink">Lead passenger ID {idRequired ? '' : <span className="text-ink-3 font-semibold text-xs">(optional)</span>}</h2>
                            {idRequired && <span className="pill-soft bg-warn-soft text-warn">Checked at boarding</span>}
                        </div>
                        <p className="text-xs text-ink-2 mb-3">{idRequired ? 'This operator verifies a government photo ID before boarding. Carry the same ID on the journey.' : 'Add an ID only if you want it printed on the ticket.'}</p>
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-5 sm:col-span-4">
                                <label className="field-label">ID type</label>
                                <select value={idType} onChange={(e) => { setIdType(e.target.value as typeof idType); setIdNumber(''); }} className={input}>
                                    {ID_TYPES.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="col-span-7 sm:col-span-8">
                                <label className="field-label">ID number</label>
                                <input value={idNumber} onChange={(e) => setIdNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20))} placeholder={idType === 'Aadhaar' ? '12-digit Aadhaar' : idType === 'PAN' ? 'ABCDE1234F' : 'Number'} className={input} />
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 md:p-5">
                        <h2 className="font-extrabold text-ink mb-3">Pay with</h2>
                        <div className="space-y-2">
                            <button type="button" onClick={() => setPay('GATEWAY')} className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-colors ${pay === 'GATEWAY' ? 'border-brand bg-brand-soft' : 'border-hair hover:border-brand/40'}`}>
                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${pay === 'GATEWAY' ? 'border-brand' : 'border-ink-3/40'}`}>{pay === 'GATEWAY' && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}</span>
                                <span className="flex-1">
                                    <span className="block text-sm font-bold text-ink">UPI · Cards · Net banking</span>
                                    <span className="block text-xs text-ink-2">PhonePe, Google Pay, Paytm, all banks. You will be redirected to a secure payment page.</span>
                                </span>
                            </button>
                            <button type="button" onClick={() => user && walletOk && setPay('WALLET')} disabled={!user || !walletOk}
                                className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-colors ${pay === 'WALLET' ? 'border-brand bg-brand-soft' : 'border-hair'} ${!user || !walletOk ? 'opacity-60 cursor-not-allowed' : 'hover:border-brand/40'}`}>
                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${pay === 'WALLET' ? 'border-brand' : 'border-ink-3/40'}`}>{pay === 'WALLET' && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}</span>
                                <span className="flex-1">
                                    <span className="block text-sm font-bold text-ink flex items-center gap-1"><Wallet size={14} /> Paymm Wallet {user && walletBalance !== null && <span className="ml-1 text-xs font-semibold text-ink-2">· balance {fmtINR(walletBalance)}</span>}</span>
                                    <span className="block text-xs text-ink-2">{!user ? 'Sign in to pay from your wallet.' : walletOk ? 'Instant, and refunds land back in the wallet immediately.' : 'Balance is lower than the fare — top up in the Paymm app.'}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                <aside className="lg:col-span-4">
                    <div className="card p-4 md:p-5 lg:sticky lg:top-28 space-y-4">
                        <div>
                            <h3 className="font-extrabold text-ink truncate">{draft.bus.operator}</h3>
                            <p className="text-xs text-ink-2 truncate">{draft.bus.busType}</p>
                        </div>
                        <dl className="text-sm space-y-2">
                            <div className="flex justify-between gap-3"><dt className="text-ink-2">Route</dt><dd className="font-bold text-ink text-right">{draft.from.name} → {draft.to.name}</dd></div>
                            <div className="flex justify-between gap-3"><dt className="text-ink-2">Date</dt><dd className="font-bold text-ink">{fmtDate(draft.date)} · {fmtTime(draft.bus.departure)}</dd></div>
                            <div className="flex justify-between gap-3"><dt className="text-ink-2">Boarding</dt><dd className="font-bold text-ink text-right truncate max-w-[60%]">{draft.boarding?.name} · {draft.boarding?.time}</dd></div>
                            {draft.dropping && <div className="flex justify-between gap-3"><dt className="text-ink-2">Dropping</dt><dd className="font-bold text-ink text-right truncate max-w-[60%]">{draft.dropping.name} · {draft.dropping.time}</dd></div>}
                            <div className="flex justify-between gap-3"><dt className="text-ink-2">Seats</dt><dd className="font-bold text-ink">{draft.seats.map((s) => s.name).join(', ')}</dd></div>
                        </dl>
                        <div className="border-t border-hair pt-3 space-y-1 text-sm">
                            {draft.seats.map((s) => <div key={s.name} className="flex justify-between"><span className="text-ink-2">Seat {s.name}</span><span className="font-semibold text-ink">{fmtINR(s.fare)}</span></div>)}
                            <div className="flex justify-between"><span className="text-ink-2">Convenience fee</span><span className="font-semibold text-ok">₹0</span></div>
                            <div className="flex justify-between text-base pt-2 border-t border-hair"><span className="font-bold text-ink">Total</span><span className="font-black text-ink">{fmtINR(total)}</span></div>
                        </div>
                        {(fieldErr || error) && <p className="text-xs font-bold text-err bg-err-soft rounded-lg p-2">{fieldErr || error}</p>}
                        <button onClick={submit} disabled={busy} className="btn-primary w-full py-3.5 text-base">
                            {busy ? 'Holding your seats…' : user ? <><Lock size={16} /> Pay {fmtINR(total)}</> : <><Lock size={16} /> Sign in & pay {fmtINR(total)}</>}
                        </button>
                        <p className="text-[11px] text-ink-3 flex items-start gap-1.5"><ShieldCheck size={14} className="shrink-0 mt-[1px]" /> Seats are held with the operator only after you tap Pay. By paying you accept the operator’s cancellation policy and Paymm’s <Link href="/terms" className="underline">terms</Link>.</p>
                    </div>
                </aside>
            </div>
        </BusShell>
    );
}

export default function BusPassengersPage() {
    return <Suspense fallback={null}><PassengersInner /></Suspense>;
}
