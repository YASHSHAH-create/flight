import React from 'react';

export const metadata = {
    title: 'Delete Account | PayMM',
    description: 'Instructions on how to delete your PayMM account.',
};

const DeleteAccountPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        Delete Account / Logout
                    </h1>
                    <p className="text-slate-400">
                        Information and instructions on how to manage or delete your PayMM account.
                    </p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">How to Delete Your Account or Logout from the App</h2>
                    <p>
                        You can easily initiate the account deletion or securely logout directly from the PayMM mobile app. Please follow these simple steps:
                    </p>
                    <ol className="list-decimal list-inside space-y-4 text-slate-300 ml-4">
                        <li>Open the <strong>PayMM app</strong> on your mobile device.</li>
                        <li>Navigate to the <strong>User Section (Profile)</strong> from the bottom menu or side navigation.</li>
                        <li>In the User Section, you will find the <strong>Logout option</strong>. You can use this to securely log out of your session on the current device.</li>
                        <li>If you wish to permanently close your account, look for the <strong>Delete Account</strong> option in the same User Section and follow the on-screen instructions to confirm your request.</li>
                    </ol>
                    <p className="mt-4 text-sm text-slate-400 bg-slate-900 p-4 rounded border border-slate-800">
                        Note: For security reasons, we process account deletions from within the app where your session is authenticated. Please make sure that you are logged in successfully to request account deletion.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">What Happens When You Delete Your Account</h2>
                    <p>
                        When you choose to delete your account, be aware of the following:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                        <li>Your personal profile data will be permanently removed from our active database.</li>
                        <li>You will lose access to past booking history, saved payment methods, and any current subscriptions.</li>
                        <li>We may retain certain transactional records as required by law for accounting, compliance, and legal purposes.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Contact Support</h2>
                    <p>
                        If you face any issues deleting your account directly from the app, or if you need assistance, please feel free to contact our support team.
                    </p>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <p><span className="font-semibold text-white">Email:</span> support@paymm.in</p>
                        <p><span className="font-semibold text-white">Phone:</span> +91 9343300271</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DeleteAccountPage;
