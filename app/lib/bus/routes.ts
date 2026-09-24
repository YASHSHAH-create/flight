import { BUS_CITIES } from './cities';
import type { BusCity } from './types';

/**
 * Curated popular bus routes — these become the landing pages
 * (/bus/delhi-to-manali etc.) used for ads and search traffic.
 *
 * Figures are typical values for planning (road distance, usual overnight
 * journey time, fare band across sleeper / seater / Volvo classes). Live fares
 * always come from the search results; the landing page says "from" and
 * "approx" for that reason.
 */
export interface BusRoute {
    a: string;            // city slug (BUS_CITIES key)
    b: string;
    km: number;           // approx road distance
    hours: [number, number]; // typical duration range
    fare: [number, number];  // typical fare band in ₹
    operators: string[];  // well-known operators on the corridor
    index: boolean;       // allowed into the sitemap / Google index
    note?: string;        // hand-written paragraph (a → b direction, reused for b → a)
    buses?: number;       // typical daily bus count
}

export const BUS_ROUTES: BusRoute[] = [
    // ── North ──────────────────────────────────────────────────────────────
    { a: 'delhi', b: 'manali', km: 540, hours: [12, 14], fare: [899, 2200], operators: ['HRTC', 'Laxmi Holidays', 'Zingbus', 'Bedi Travels'], index: true, buses: 80,
      note: 'Delhi to Manali is the busiest hill route in North India. Almost every bus is an overnight Volvo or sleeper: it leaves Delhi (Majnu ka Tilla, Kashmere Gate ISBT, RK Ashram) between 5 pm and 10 pm and reaches Manali the next morning, so you save a hotel night. Book 5–7 days ahead for weekends, long weekends and the Dec–Jan snow season, when fares roughly double.' },
    { a: 'delhi', b: 'jaipur', km: 280, hours: [5, 6], fare: [399, 1200], operators: ['RSRTC', 'Zingbus', 'IntrCity SmartBus', 'Jakhar Travels'], index: true, buses: 150,
      note: 'Delhi to Jaipur runs all day on the NH48 expressway with buses every 15–30 minutes from Dhaula Kuan, Kashmere Gate and Kapashera. Day buses take about 5 hours; AC seaters are the best value and Volvo sleepers are only worth it for late-night departures. Weekend and Diwali fares rise, otherwise walk-up fares are stable.' },
    { a: 'delhi', b: 'chandigarh', km: 250, hours: [4.5, 6], fare: [349, 1100], operators: ['Haryana Roadways', 'PRTC', 'Zingbus', 'Laxmi Holidays'], index: true, buses: 200,
      note: 'Delhi to Chandigarh is a 5-hour daytime run with departures every few minutes from Kashmere Gate ISBT. AC seater and Volvo buses dominate; many Manali and Shimla buses also stop at Chandigarh (Sector 43 ISBT / Zirakpur), which gives you extra late-night options.' },
    { a: 'delhi', b: 'dehradun', km: 255, hours: [5.5, 7], fare: [399, 1200], operators: ['Uttarakhand Roadways', 'Zingbus', 'Laxmi Holidays', 'Kalpana Travels'], index: true, buses: 120,
      note: 'Delhi to Dehradun buses leave from Kashmere Gate ISBT and Anand Vihar round the clock. The new Delhi–Dehradun expressway sections have cut the trip to around 5–6 hours. Many buses continue to Mussoorie or Rishikesh, so check the dropping points if you are heading to the hills.' },
    { a: 'delhi', b: 'agra', km: 230, hours: [3.5, 4.5], fare: [299, 900], operators: ['UPSRTC', 'Zingbus', 'IntrCity SmartBus'], index: true, buses: 100,
      note: 'Delhi to Agra on the Yamuna Expressway is a quick 3.5–4-hour ride. Early-morning departures (5–7 am) are ideal for a Taj Mahal day trip with an evening return. AC seater buses are plentiful; sleepers are rarely needed on this short hop.' },
    { a: 'delhi', b: 'lucknow', km: 555, hours: [8, 10], fare: [599, 1800], operators: ['UPSRTC', 'Zingbus', 'IntrCity SmartBus', 'Laxmi Holidays'], index: true, buses: 90,
      note: 'Delhi to Lucknow overnight buses use the Agra–Lucknow Expressway and arrive early morning. Sleeper and Volvo semi-sleeper coaches leave Anand Vihar and Kashmere Gate between 6 pm and 11 pm. Fares spike around Holi, Diwali and Chhath, so book a week ahead for festival travel.' },
    { a: 'delhi', b: 'haridwar', km: 225, hours: [5, 6.5], fare: [349, 1000], operators: ['Uttarakhand Roadways', 'Zingbus', 'Kalpana Travels'], index: true, buses: 100,
      note: 'Delhi to Haridwar buses run 24×7 from Kashmere Gate ISBT; most continue to Rishikesh. Volvo and AC seater buses take 5–6 hours. During Kanwar Yatra (July–August) and Kumbh events, expect diversions and book well ahead.' },
    { a: 'delhi', b: 'shimla', km: 350, hours: [8, 10], fare: [699, 1800], operators: ['HRTC', 'Laxmi Holidays', 'Zingbus'], index: true, buses: 60,
      note: 'Delhi to Shimla is an overnight Volvo run of 8–10 hours via Chandigarh and Solan. HRTC Volvos are the most reliable; private operators add sleeper coaches on weekends. Buses drop at Old Bus Stand / Tutikandi ISBT, from where local taxis reach the Mall Road area.' },
    { a: 'delhi', b: 'rishikesh', km: 240, hours: [5.5, 7], fare: [399, 1100], operators: ['Uttarakhand Roadways', 'Zingbus', 'Kalpana Travels'], index: true, buses: 80 },
    { a: 'delhi', b: 'amritsar', km: 450, hours: [7, 9], fare: [599, 1600], operators: ['PRTC', 'Punbus', 'Zingbus', 'Laxmi Holidays'], index: true, buses: 60 },
    { a: 'delhi', b: 'udaipur', km: 660, hours: [11, 13], fare: [799, 2000], operators: ['RSRTC', 'Jakhar Travels', 'Shrinath Travels', 'Zingbus'], index: true, buses: 40 },
    { a: 'delhi', b: 'jodhpur', km: 600, hours: [10, 12], fare: [699, 1800], operators: ['RSRTC', 'Jakhar Travels', 'Mahalaxmi Travels'], index: true, buses: 40 },
    { a: 'delhi', b: 'nainital', km: 320, hours: [7, 9], fare: [599, 1500], operators: ['Uttarakhand Roadways', 'Zingbus', 'Laxmi Holidays'], index: true, buses: 30 },
    { a: 'delhi', b: 'varanasi', km: 820, hours: [12, 15], fare: [899, 2400], operators: ['UPSRTC', 'Zingbus', 'IntrCity SmartBus'], index: true, buses: 30 },
    { a: 'delhi', b: 'ajmer', km: 415, hours: [7, 8], fare: [499, 1300], operators: ['RSRTC', 'Jakhar Travels', 'Zingbus'], index: false, buses: 50 },
    { a: 'delhi', b: 'mathura', km: 180, hours: [3, 4], fare: [249, 700], operators: ['UPSRTC', 'Zingbus'], index: false, buses: 60 },
    { a: 'delhi', b: 'ayodhya', km: 690, hours: [10, 12], fare: [799, 2000], operators: ['UPSRTC', 'Zingbus', 'IntrCity SmartBus'], index: true, buses: 25 },
    { a: 'delhi', b: 'mussoorie', km: 290, hours: [7, 8], fare: [599, 1400], operators: ['Uttarakhand Roadways', 'Laxmi Holidays'], index: false, buses: 15 },
    { a: 'chandigarh', b: 'manali', km: 300, hours: [8, 9], fare: [699, 1600], operators: ['HRTC', 'Laxmi Holidays', 'Zingbus'], index: true, buses: 50 },
    { a: 'chandigarh', b: 'shimla', km: 115, hours: [3.5, 4.5], fare: [299, 900], operators: ['HRTC', 'Laxmi Holidays'], index: true, buses: 60 },
    { a: 'jaipur', b: 'udaipur', km: 400, hours: [6.5, 8], fare: [499, 1300], operators: ['RSRTC', 'Jain Travels', 'Shrinath Travels', 'Mahalaxmi Travels'], index: true, buses: 80 },
    { a: 'jaipur', b: 'jodhpur', km: 340, hours: [5.5, 7], fare: [449, 1200], operators: ['RSRTC', 'Jain Travels', 'Jakhar Travels'], index: true, buses: 70 },
    { a: 'jaipur', b: 'ajmer', km: 135, hours: [2.5, 3.5], fare: [199, 600], operators: ['RSRTC', 'Jain Travels'], index: false, buses: 80 },
    { a: 'jaipur', b: 'ahmedabad', km: 660, hours: [10, 12], fare: [699, 1800], operators: ['RSRTC', 'GSRTC', 'Shrinath Travels', 'Jakhar Travels'], index: true, buses: 40 },
    { a: 'jaipur', b: 'agra', km: 240, hours: [4.5, 5.5], fare: [349, 900], operators: ['RSRTC', 'UPSRTC', 'Zingbus'], index: false, buses: 40 },
    { a: 'jaipur', b: 'jaisalmer', km: 560, hours: [9, 11], fare: [599, 1500], operators: ['RSRTC', 'Jain Travels', 'Mahalaxmi Travels'], index: false, buses: 20 },
    { a: 'lucknow', b: 'varanasi', km: 300, hours: [5, 6.5], fare: [399, 1100], operators: ['UPSRTC', 'Zingbus', 'IntrCity SmartBus'], index: true, buses: 60 },
    { a: 'lucknow', b: 'ayodhya', km: 135, hours: [2.5, 3.5], fare: [199, 600], operators: ['UPSRTC', 'Zingbus'], index: false, buses: 60 },
    { a: 'lucknow', b: 'agra', km: 330, hours: [4.5, 6], fare: [449, 1200], operators: ['UPSRTC', 'Zingbus', 'IntrCity SmartBus'], index: false, buses: 40 },
    { a: 'amritsar', b: 'chandigarh', km: 230, hours: [4, 5], fare: [349, 900], operators: ['PRTC', 'Punbus', 'Laxmi Holidays'], index: false, buses: 60 },
    { a: 'dehradun', b: 'haridwar', km: 55, hours: [1.5, 2], fare: [99, 400], operators: ['Uttarakhand Roadways'], index: false, buses: 60 },

    // ── West / Central ─────────────────────────────────────────────────────
    { a: 'mumbai', b: 'pune', km: 150, hours: [3, 4], fare: [299, 900], operators: ['MSRTC Shivneri', 'Neeta Tours', 'Purple', 'IntrCity SmartBus'], index: true, buses: 300,
      note: 'Mumbai to Pune is India\'s highest-frequency intercity bus corridor, with a bus every few minutes from Dadar, Sion, Borivali, Thane and Vashi via the Expressway. MSRTC Shivneri AC buses are the benchmark; private Volvos add pickups in Andheri and Powai. Expect 3–4 hours, more on Friday evenings and Monday mornings.' },
    { a: 'mumbai', b: 'goa', km: 590, hours: [11, 14], fare: [899, 2500], operators: ['Paulo Travels', 'Neeta Tours', 'VRL', 'Kadamba', 'Zingbus'], index: true, buses: 120,
      note: 'Mumbai to Goa overnight sleepers leave Borivali, Andheri, Dadar and Sion between 4 pm and 10 pm and reach Mapusa, Panjim or Margao the next morning. AC sleepers are the norm; Volvo multi-axle semi-sleepers are a bit cheaper. December and long weekends sell out early — book at least a week ahead.' },
    { a: 'mumbai', b: 'shirdi', km: 240, hours: [5, 6.5], fare: [399, 1200], operators: ['MSRTC', 'Neeta Tours', 'Konduskar', 'Sai Travels'], index: true, buses: 120,
      note: 'Mumbai to Shirdi has departures through the day and night from Dadar, Sion, Thane and Kalyan. Overnight buses reach Shirdi around 5 am — ideal for Kakad Aarti. Day buses via the Samruddhi Expressway can do it in about 5 hours.' },
    { a: 'mumbai', b: 'nashik', km: 170, hours: [3.5, 4.5], fare: [299, 900], operators: ['MSRTC', 'Neeta Tours', 'Purple'], index: true, buses: 150 },
    { a: 'mumbai', b: 'ahmedabad', km: 530, hours: [8, 10], fare: [599, 1800], operators: ['GSRTC', 'Neeta Tours', 'Shrinath Travels', 'Patel Tours', 'Zingbus'], index: true, buses: 100,
      note: 'Mumbai to Ahmedabad buses run overnight along NH48 via Vapi, Valsad, Surat and Vadodara. Sleeper coaches leave Borivali and Andheri between 7 pm and midnight; Volvo seaters are cheaper for daytime travel. Most Gujarat operators also stop at Bharuch and Anand.' },
    { a: 'mumbai', b: 'surat', km: 280, hours: [5, 6], fare: [399, 1200], operators: ['GSRTC', 'Neeta Tours', 'Patel Tours', 'Shrinath Travels'], index: true, buses: 120 },
    { a: 'mumbai', b: 'indore', km: 590, hours: [11, 13], fare: [799, 2200], operators: ['Hans Travels', 'Verma Travels', 'Chartered Bus', 'Zingbus'], index: true, buses: 60,
      note: 'Mumbai to Indore overnight sleepers depart Borivali, Andheri and Thane from 4 pm onwards and reach Indore (Rau, Bhawarkuan, AICTSL) the next morning. Chartered Bus and Hans Travels run AC sleepers; Verma Travels runs multi-axle Volvos.' },
    { a: 'mumbai', b: 'hyderabad', km: 710, hours: [12, 15], fare: [999, 2600], operators: ['VRL', 'Orange Tours', 'SRS Travels', 'Kaveri Travels'], index: true, buses: 60 },
    { a: 'mumbai', b: 'bangalore', km: 985, hours: [15, 18], fare: [1199, 3200], operators: ['VRL', 'SRS Travels', 'Orange Tours', 'National Travels'], index: true, buses: 50 },
    { a: 'mumbai', b: 'kolhapur', km: 380, hours: [7, 9], fare: [499, 1500], operators: ['MSRTC', 'Neeta Tours', 'Konduskar', 'VRL'], index: true, buses: 100 },
    { a: 'mumbai', b: 'mahabaleshwar', km: 265, hours: [6, 7], fare: [499, 1300], operators: ['MSRTC', 'Neeta Tours', 'Purple'], index: false, buses: 30 },
    { a: 'mumbai', b: 'vadodara', km: 420, hours: [7, 8], fare: [499, 1500], operators: ['GSRTC', 'Neeta Tours', 'Patel Tours'], index: false, buses: 80 },
    { a: 'mumbai', b: 'udaipur', km: 760, hours: [13, 15], fare: [999, 2400], operators: ['Shrinath Travels', 'Jain Travels', 'Neeta Tours'], index: false, buses: 30 },
    { a: 'mumbai', b: 'solapur', km: 400, hours: [7, 9], fare: [499, 1400], operators: ['MSRTC', 'Neeta Tours', 'Konduskar'], index: false, buses: 60 },
    { a: 'pune', b: 'goa', km: 450, hours: [9, 12], fare: [699, 2200], operators: ['Paulo Travels', 'Neeta Tours', 'VRL', 'Kadamba', 'Zingbus'], index: true, buses: 100,
      note: 'Pune to Goa overnight buses leave Swargate, Wakad and Hinjewadi between 6 pm and 11 pm, reaching Mapusa or Panjim in the morning. AC sleepers and Volvo semi-sleepers both run daily; the NH48 route via Kolhapur and Amboli Ghat is standard.' },
    { a: 'pune', b: 'hyderabad', km: 560, hours: [9, 12], fare: [799, 2200], operators: ['VRL', 'Orange Tours', 'SRS Travels', 'Kaveri Travels'], index: true, buses: 80 },
    { a: 'pune', b: 'bangalore', km: 840, hours: [13, 16], fare: [999, 2800], operators: ['VRL', 'SRS Travels', 'Orange Tours', 'National Travels'], index: true, buses: 60 },
    { a: 'pune', b: 'nashik', km: 210, hours: [4.5, 5.5], fare: [349, 1000], operators: ['MSRTC', 'Neeta Tours', 'Purple'], index: true, buses: 100 },
    { a: 'pune', b: 'shirdi', km: 185, hours: [4, 5], fare: [349, 1000], operators: ['MSRTC', 'Neeta Tours', 'Konduskar'], index: true, buses: 100 },
    { a: 'pune', b: 'indore', km: 600, hours: [11, 13], fare: [799, 2200], operators: ['Hans Travels', 'Verma Travels', 'Chartered Bus'], index: true, buses: 40 },
    { a: 'pune', b: 'kolhapur', km: 235, hours: [4.5, 5.5], fare: [349, 1000], operators: ['MSRTC', 'Neeta Tours', 'Konduskar'], index: true, buses: 120 },
    { a: 'pune', b: 'mahabaleshwar', km: 120, hours: [3, 4], fare: [249, 800], operators: ['MSRTC', 'Neeta Tours'], index: false, buses: 30 },
    { a: 'pune', b: 'surat', km: 400, hours: [7, 9], fare: [599, 1600], operators: ['GSRTC', 'Neeta Tours', 'Patel Tours'], index: false, buses: 40 },
    { a: 'pune', b: 'ahmedabad', km: 660, hours: [10, 12], fare: [699, 2000], operators: ['GSRTC', 'Neeta Tours', 'Shrinath Travels'], index: true, buses: 50 },
    { a: 'pune', b: 'nagpur', km: 720, hours: [10, 13], fare: [899, 2400], operators: ['MSRTC', 'Purple', 'Khurana Travels', 'Zingbus'], index: true, buses: 40 },
    { a: 'pune', b: 'solapur', km: 250, hours: [4.5, 6], fare: [349, 1000], operators: ['MSRTC', 'Neeta Tours'], index: false, buses: 80 },
    { a: 'ahmedabad', b: 'udaipur', km: 260, hours: [4.5, 6], fare: [349, 1100], operators: ['GSRTC', 'Shrinath Travels', 'Patel Tours', 'Jain Travels'], index: true, buses: 100 },
    { a: 'ahmedabad', b: 'surat', km: 265, hours: [4, 5.5], fare: [299, 900], operators: ['GSRTC', 'Patel Tours', 'Shrinath Travels'], index: true, buses: 200 },
    { a: 'ahmedabad', b: 'rajkot', km: 215, hours: [3.5, 4.5], fare: [249, 800], operators: ['GSRTC', 'Patel Tours', 'Eagle Travels'], index: true, buses: 200 },
    { a: 'ahmedabad', b: 'mount-abu', km: 230, hours: [4.5, 6], fare: [349, 1000], operators: ['GSRTC', 'Shrinath Travels', 'Patel Tours'], index: true, buses: 40 },
    { a: 'ahmedabad', b: 'indore', km: 400, hours: [7, 9], fare: [499, 1500], operators: ['Shrinath Travels', 'Hans Travels', 'Chartered Bus'], index: true, buses: 40 },
    { a: 'ahmedabad', b: 'vadodara', km: 110, hours: [2, 2.5], fare: [149, 500], operators: ['GSRTC', 'Patel Tours'], index: false, buses: 200 },
    { a: 'ahmedabad', b: 'jamnagar', km: 300, hours: [5, 6.5], fare: [349, 1000], operators: ['GSRTC', 'Patel Tours', 'Eagle Travels'], index: false, buses: 80 },
    { a: 'ahmedabad', b: 'bhavnagar', km: 175, hours: [3.5, 4.5], fare: [249, 700], operators: ['GSRTC', 'Patel Tours'], index: false, buses: 80 },
    { a: 'ahmedabad', b: 'dwarka', km: 440, hours: [8, 10], fare: [499, 1300], operators: ['GSRTC', 'Patel Tours', 'Eagle Travels'], index: false, buses: 30 },
    { a: 'ahmedabad', b: 'jodhpur', km: 450, hours: [8, 10], fare: [499, 1400], operators: ['RSRTC', 'GSRTC', 'Jain Travels', 'Shrinath Travels'], index: false, buses: 40 },
    { a: 'surat', b: 'vadodara', km: 150, hours: [2.5, 3.5], fare: [199, 600], operators: ['GSRTC', 'Patel Tours'], index: false, buses: 150 },
    { a: 'indore', b: 'bhopal', km: 195, hours: [3.5, 4.5], fare: [299, 800], operators: ['Chartered Bus', 'Hans Travels', 'Verma Travels', 'MPSRTC'], index: true, buses: 150,
      note: 'Indore to Bhopal has an AC bus roughly every 15 minutes through the day from Rau, Bhawarkuan, Vijay Nagar and AICTSL. Chartered Bus Volvos are the fastest at about 3.5 hours via the Dewas bypass. Night departures are fewer, so plan around the 6 am–10 pm window.' },
    { a: 'indore', b: 'ujjain', km: 55, hours: [1.5, 2], fare: [99, 350], operators: ['Chartered Bus', 'MPSRTC'], index: false, buses: 100 },
    { a: 'indore', b: 'jabalpur', km: 500, hours: [9, 11], fare: [599, 1600], operators: ['Chartered Bus', 'Hans Travels', 'Verma Travels'], index: false, buses: 30 },
    { a: 'indore', b: 'nagpur', km: 500, hours: [8, 11], fare: [599, 1700], operators: ['Chartered Bus', 'Verma Travels', 'Hans Travels', 'Khurana Travels'], index: true, buses: 40 },
    { a: 'bhopal', b: 'jabalpur', km: 330, hours: [5.5, 7], fare: [399, 1100], operators: ['Chartered Bus', 'Verma Travels', 'MPSRTC'], index: false, buses: 60 },
    { a: 'bhopal', b: 'nagpur', km: 350, hours: [6, 8], fare: [449, 1300], operators: ['Chartered Bus', 'Verma Travels', 'Hans Travels'], index: false, buses: 40 },
    { a: 'nagpur', b: 'hyderabad', km: 500, hours: [8, 10], fare: [599, 1700], operators: ['VRL', 'Orange Tours', 'Khurana Travels', 'Kaveri Travels'], index: true, buses: 60 },

    // ── South ──────────────────────────────────────────────────────────────
    { a: 'bangalore', b: 'chennai', km: 350, hours: [6, 8], fare: [499, 1600], operators: ['KSRTC Airavat', 'SETC', 'VRL', 'SRS Travels', 'Zingbus', 'IntrCity SmartBus'], index: true, buses: 300,
      note: 'Bangalore to Chennai is one of the busiest corridors in the South, with buses every 10–15 minutes from Madiwala, Shantinagar, Majestic and Electronic City via the Hosur–Krishnagiri–Vellore highway. KSRTC Airavat and SETC are dependable; private Volvos and sleepers run through the night. Fares jump on Friday and Sunday evenings.' },
    { a: 'bangalore', b: 'hyderabad', km: 570, hours: [8, 11], fare: [699, 2200], operators: ['KSRTC Airavat', 'TSRTC Garuda', 'Orange Tours', 'VRL', 'SRS Travels', 'Zingbus'], index: true, buses: 250,
      note: 'Bangalore to Hyderabad runs overnight along NH44 via Anantapur and Kurnool. Sleeper and Volvo semi-sleeper departures cluster between 7 pm and 11 pm from Madiwala, Silk Board, Hebbal and Yelahanka, arriving at Shamshabad, Aramghar or Miyapur early morning. TSRTC Garuda and KSRTC Airavat are the reliable state options.' },
    { a: 'bangalore', b: 'goa', km: 560, hours: [10, 13], fare: [899, 2600], operators: ['Paulo Travels', 'VRL', 'Sugama', 'Kadamba', 'SRS Travels'], index: true, buses: 80,
      note: 'Bangalore to Goa overnight sleepers leave Anand Rao Circle, Yeshwanthpur and Hebbal between 5 pm and 10 pm and reach Madgaon or Panjim in the morning via Hubli. AC sleepers are the most popular class; fares double around Christmas and New Year.' },
    { a: 'bangalore', b: 'mysore', km: 145, hours: [3, 3.5], fare: [199, 700], operators: ['KSRTC Airavat', 'KSRTC Ambaari', 'Flybus'], index: true, buses: 300 },
    { a: 'bangalore', b: 'coimbatore', km: 365, hours: [6.5, 8], fare: [499, 1500], operators: ['KSRTC', 'SETC', 'KPN Travels', 'SRS Travels', 'IntrCity SmartBus'], index: true, buses: 120 },
    { a: 'bangalore', b: 'mangalore', km: 350, hours: [6.5, 8], fare: [499, 1500], operators: ['KSRTC Airavat', 'Sugama', 'VRL', 'Durgamba'], index: true, buses: 100 },
    { a: 'bangalore', b: 'tirupati', km: 250, hours: [5, 6.5], fare: [399, 1200], operators: ['APSRTC', 'KSRTC', 'SRS Travels', 'Kaveri Travels'], index: true, buses: 150 },
    { a: 'bangalore', b: 'ooty', km: 270, hours: [7, 8.5], fare: [499, 1500], operators: ['KSRTC', 'TNSTC', 'SRS Travels'], index: true, buses: 20 },
    { a: 'bangalore', b: 'madurai', km: 435, hours: [8, 10], fare: [599, 1800], operators: ['SETC', 'KPN Travels', 'SRS Travels', 'IntrCity SmartBus'], index: true, buses: 80 },
    { a: 'bangalore', b: 'kozhikode', km: 360, hours: [7, 9], fare: [599, 1700], operators: ['KSRTC', 'Kerala RTC', 'Kallada', 'SRS Travels'], index: true, buses: 60 },
    { a: 'bangalore', b: 'hubli', km: 410, hours: [6.5, 8], fare: [499, 1500], operators: ['KSRTC Airavat', 'VRL', 'SRS Travels'], index: true, buses: 120 },
    { a: 'bangalore', b: 'pondicherry', km: 310, hours: [6, 7.5], fare: [499, 1400], operators: ['KSRTC', 'SETC', 'SRS Travels', 'KPN Travels'], index: true, buses: 40 },
    { a: 'bangalore', b: 'vijayawada', km: 650, hours: [10, 13], fare: [799, 2200], operators: ['APSRTC', 'Orange Tours', 'Kaveri Travels', 'Morning Star'], index: false, buses: 60 },
    { a: 'bangalore', b: 'udupi', km: 400, hours: [7.5, 9], fare: [549, 1600], operators: ['KSRTC', 'Sugama', 'VRL', 'Durgamba'], index: false, buses: 60 },
    { a: 'bangalore', b: 'kochi', km: 540, hours: [10, 12], fare: [799, 2200], operators: ['KSRTC', 'Kerala RTC', 'Kallada', 'SRS Travels'], index: true, buses: 60 },
    { a: 'bangalore', b: 'chikmagalur', km: 240, hours: [5, 6.5], fare: [399, 1200], operators: ['KSRTC', 'Sugama', 'VRL'], index: false, buses: 40 },
    { a: 'bangalore', b: 'gokarna', km: 480, hours: [9, 11], fare: [699, 1800], operators: ['KSRTC', 'VRL', 'Sugama', 'Paulo Travels'], index: false, buses: 20 },
    { a: 'bangalore', b: 'hampi', km: 340, hours: [6.5, 8], fare: [499, 1400], operators: ['KSRTC', 'VRL', 'SRS Travels'], index: false, buses: 15 },
    { a: 'bangalore', b: 'salem', km: 200, hours: [3.5, 5], fare: [299, 900], operators: ['KSRTC', 'SETC', 'KPN Travels'], index: false, buses: 120 },
    { a: 'bangalore', b: 'vellore', km: 215, hours: [4, 5], fare: [299, 900], operators: ['KSRTC', 'SETC', 'SRS Travels'], index: false, buses: 100 },
    { a: 'bangalore', b: 'trivandrum', km: 730, hours: [13, 16], fare: [999, 2800], operators: ['Kerala RTC', 'KSRTC', 'Kallada', 'SRS Travels'], index: false, buses: 30 },
    { a: 'hyderabad', b: 'chennai', km: 630, hours: [10, 13], fare: [799, 2400], operators: ['TSRTC Garuda', 'SETC', 'Orange Tours', 'Kaveri Travels', 'SRS Travels'], index: true, buses: 100 },
    { a: 'hyderabad', b: 'vijayawada', km: 275, hours: [4.5, 6], fare: [349, 1100], operators: ['APSRTC', 'TSRTC', 'Orange Tours', 'Kaveri Travels', 'Morning Star'], index: true, buses: 250,
      note: 'Hyderabad to Vijayawada has departures every 10 minutes through the day from MGBS, Uppal, LB Nagar and Kukatpally via NH65. APSRTC Garuda and Amaravati coaches are the mainstay; private Volvos and sleepers add late-night options. Expect 4.5–5.5 hours.' },
    { a: 'hyderabad', b: 'visakhapatnam', km: 620, hours: [10, 13], fare: [799, 2400], operators: ['APSRTC', 'Orange Tours', 'Kaveri Travels', 'Morning Star'], index: true, buses: 120 },
    { a: 'hyderabad', b: 'tirupati', km: 560, hours: [9, 12], fare: [699, 2000], operators: ['APSRTC', 'TSRTC', 'Kaveri Travels', 'Orange Tours'], index: true, buses: 120 },
    { a: 'hyderabad', b: 'goa', km: 660, hours: [12, 15], fare: [999, 2800], operators: ['VRL', 'Paulo Travels', 'Orange Tours', 'SRS Travels'], index: true, buses: 40 },
    { a: 'hyderabad', b: 'kurnool', km: 215, hours: [3.5, 5], fare: [299, 900], operators: ['APSRTC', 'TSRTC', 'Orange Tours'], index: false, buses: 150 },
    { a: 'hyderabad', b: 'rajahmundry', km: 450, hours: [7.5, 9.5], fare: [599, 1700], operators: ['APSRTC', 'Kaveri Travels', 'Orange Tours'], index: false, buses: 80 },
    { a: 'hyderabad', b: 'nellore', km: 470, hours: [8, 10], fare: [599, 1700], operators: ['APSRTC', 'TSRTC', 'Kaveri Travels'], index: false, buses: 60 },
    { a: 'chennai', b: 'coimbatore', km: 500, hours: [7.5, 9.5], fare: [599, 1800], operators: ['SETC', 'KPN Travels', 'Parveen Travels', 'SRS Travels', 'IntrCity SmartBus'], index: true, buses: 200,
      note: 'Chennai to Coimbatore overnight buses leave Koyambedu, Perungalathur and Vadapalani between 8 pm and midnight, arriving at Gandhipuram around 6 am. SETC Ultra Deluxe and KPN sleepers are the mainstays; Parveen and IntrCity run AC sleepers with live tracking.' },
    { a: 'chennai', b: 'madurai', km: 460, hours: [7, 9], fare: [549, 1700], operators: ['SETC', 'KPN Travels', 'Parveen Travels', 'SRM Transports', 'IntrCity SmartBus'], index: true, buses: 200,
      note: 'Chennai to Madurai runs through the night from Koyambedu and Tambaram on NH38 via Trichy. SETC has the most departures; private sleepers (KPN, Parveen, SRM) leave every few minutes between 9 pm and 11.30 pm and reach Mattuthavani by morning.' },
    { a: 'chennai', b: 'pondicherry', km: 160, hours: [3, 4], fare: [199, 700], operators: ['SETC', 'PRTC', 'Parveen Travels'], index: true, buses: 150 },
    { a: 'chennai', b: 'tirupati', km: 135, hours: [3, 4], fare: [199, 700], operators: ['APSRTC', 'SETC', 'SRS Travels'], index: true, buses: 200 },
    { a: 'chennai', b: 'salem', km: 340, hours: [5.5, 7], fare: [449, 1300], operators: ['SETC', 'KPN Travels', 'Parveen Travels'], index: false, buses: 150 },
    { a: 'chennai', b: 'vellore', km: 140, hours: [2.5, 3.5], fare: [199, 600], operators: ['SETC', 'TNSTC'], index: false, buses: 150 },
    { a: 'chennai', b: 'tirunelveli', km: 620, hours: [10, 12], fare: [699, 2000], operators: ['SETC', 'KPN Travels', 'Parveen Travels', 'SRM Transports'], index: true, buses: 100 },
    { a: 'chennai', b: 'nagercoil', km: 700, hours: [11, 13], fare: [799, 2200], operators: ['SETC', 'KPN Travels', 'Parveen Travels'], index: false, buses: 60 },
    { a: 'chennai', b: 'thanjavur', km: 350, hours: [6, 7.5], fare: [449, 1300], operators: ['SETC', 'KPN Travels', 'Parveen Travels'], index: false, buses: 80 },
    { a: 'chennai', b: 'kodaikanal', km: 525, hours: [9, 11], fare: [699, 1900], operators: ['SETC', 'KPN Travels', 'Parveen Travels'], index: false, buses: 15 },
    { a: 'chennai', b: 'kochi', km: 690, hours: [12, 14], fare: [899, 2500], operators: ['Kerala RTC', 'KPN Travels', 'Kallada', 'Parveen Travels'], index: false, buses: 40 },
    { a: 'coimbatore', b: 'madurai', km: 215, hours: [4, 5], fare: [299, 900], operators: ['SETC', 'TNSTC', 'KPN Travels'], index: false, buses: 100 },
    { a: 'coimbatore', b: 'kochi', km: 190, hours: [4, 5], fare: [299, 900], operators: ['Kerala RTC', 'KPN Travels', 'Kallada'], index: false, buses: 80 },
    { a: 'madurai', b: 'tirunelveli', km: 160, hours: [3, 4], fare: [199, 700], operators: ['SETC', 'TNSTC', 'KPN Travels'], index: false, buses: 120 },
    { a: 'kochi', b: 'trivandrum', km: 205, hours: [4.5, 5.5], fare: [299, 900], operators: ['Kerala RTC', 'Kallada', 'KPN Travels'], index: false, buses: 100 },
    { a: 'kochi', b: 'kozhikode', km: 185, hours: [4.5, 5.5], fare: [299, 900], operators: ['Kerala RTC', 'Kallada'], index: false, buses: 100 },
    { a: 'vijayawada', b: 'visakhapatnam', km: 350, hours: [6, 7.5], fare: [449, 1300], operators: ['APSRTC', 'Orange Tours', 'Kaveri Travels', 'Morning Star'], index: false, buses: 150 },
    { a: 'mangalore', b: 'goa', km: 360, hours: [7, 9], fare: [499, 1500], operators: ['Paulo Travels', 'Sugama', 'VRL', 'Kadamba'], index: false, buses: 30 },

    // ── East ───────────────────────────────────────────────────────────────
    { a: 'kolkata', b: 'digha', km: 185, hours: [4, 5], fare: [199, 700], operators: ['WBTC', 'SBSTC', 'Shyamoli', 'Greenline'], index: true, buses: 100,
      note: 'Kolkata to Digha buses leave Esplanade and Karunamoyee from early morning; AC Volvos by WBTC and Greenline are the comfortable pick and take about 4 hours via the Kolaghat–Nandakumar highway. Weekend and holiday morning buses fill up fast.' },
    { a: 'kolkata', b: 'siliguri', km: 580, hours: [11, 13], fare: [699, 2000], operators: ['NBSTC', 'Shyamoli', 'Greenline', 'Royal Cruiser'], index: true, buses: 60 },
    { a: 'kolkata', b: 'puri', km: 500, hours: [9, 11], fare: [599, 1700], operators: ['Shyamoli', 'Greenline', 'OSRTC', 'Dolphin'], index: true, buses: 30 },
    { a: 'kolkata', b: 'bhubaneswar', km: 440, hours: [8, 10], fare: [549, 1600], operators: ['Shyamoli', 'Greenline', 'OSRTC', 'Dolphin'], index: false, buses: 40 },
    { a: 'kolkata', b: 'ranchi', km: 400, hours: [8, 10], fare: [499, 1500], operators: ['Shyamoli', 'Greenline', 'Royal Cruiser'], index: false, buses: 30 },
    { a: 'kolkata', b: 'jamshedpur', km: 280, hours: [5.5, 7], fare: [399, 1200], operators: ['Shyamoli', 'Greenline', 'Royal Cruiser'], index: false, buses: 40 },
    { a: 'patna', b: 'ranchi', km: 330, hours: [6.5, 8], fare: [449, 1300], operators: ['BSRTC', 'Shyamoli', 'Royal Cruiser', 'Zingbus'], index: true, buses: 60 },
    { a: 'patna', b: 'kolkata', km: 580, hours: [10, 12], fare: [699, 2000], operators: ['Shyamoli', 'Royal Cruiser', 'Greenline'], index: true, buses: 30 },
    { a: 'patna', b: 'gaya', km: 100, hours: [2.5, 3.5], fare: [149, 500], operators: ['BSRTC'], index: false, buses: 60 },
    { a: 'patna', b: 'muzaffarpur', km: 75, hours: [2, 3], fare: [99, 400], operators: ['BSRTC'], index: false, buses: 80 },
    { a: 'patna', b: 'varanasi', km: 250, hours: [5, 6.5], fare: [349, 1000], operators: ['BSRTC', 'UPSRTC', 'Zingbus'], index: false, buses: 40 },
    { a: 'patna', b: 'lucknow', km: 530, hours: [9, 11], fare: [599, 1700], operators: ['UPSRTC', 'BSRTC', 'Zingbus'], index: false, buses: 20 },
    { a: 'ranchi', b: 'jamshedpur', km: 130, hours: [3, 4], fare: [199, 600], operators: ['Shyamoli', 'Royal Cruiser'], index: false, buses: 80 },
    { a: 'guwahati', b: 'siliguri', km: 460, hours: [9, 11], fare: [599, 1600], operators: ['ASTC', 'NBSTC', 'Royal Cruiser', 'Network Travels'], index: false, buses: 40 },
];

export interface ResolvedRoute {
    slug: string;
    reverseSlug: string;
    from: BusCity;
    to: BusCity;
    fromSlug: string;
    toSlug: string;
    route: BusRoute;
}

const toSlug = (a: string, b: string) => `${a}-to-${b}`;

/** Every route in both directions. */
export const ALL_ROUTE_SLUGS: ResolvedRoute[] = BUS_ROUTES.flatMap((route) => {
    const A = BUS_CITIES[route.a];
    const B = BUS_CITIES[route.b];
    if (!A || !B) return [];
    return [
        { slug: toSlug(route.a, route.b), reverseSlug: toSlug(route.b, route.a), from: A, to: B, fromSlug: route.a, toSlug: route.b, route },
        { slug: toSlug(route.b, route.a), reverseSlug: toSlug(route.a, route.b), from: B, to: A, fromSlug: route.b, toSlug: route.a, route },
    ];
});

const BY_SLUG = new Map(ALL_ROUTE_SLUGS.map((r) => [r.slug, r]));

export const resolveRouteSlug = (slug: string): ResolvedRoute | undefined => BY_SLUG.get(slug.toLowerCase());

export const indexableRoutes = () => ALL_ROUTE_SLUGS.filter((r) => r.route.index);

/** Routes that start or end in a given city (for "more from X" links). */
export const routesForCity = (citySlug: string, limit = 8) =>
    ALL_ROUTE_SLUGS.filter((r) => r.fromSlug === citySlug).slice(0, limit);

/** Hero / ads picks on the /bus landing page. */
export const FEATURED_ROUTE_SLUGS = [
    'delhi-to-manali', 'mumbai-to-goa', 'bangalore-to-chennai', 'delhi-to-jaipur',
    'mumbai-to-pune', 'hyderabad-to-bangalore', 'delhi-to-chandigarh', 'pune-to-goa',
    'bangalore-to-hyderabad', 'chennai-to-coimbatore', 'mumbai-to-shirdi', 'delhi-to-dehradun',
    'kolkata-to-digha', 'hyderabad-to-vijayawada', 'ahmedabad-to-udaipur', 'indore-to-bhopal',
];

export const formatHours = (h: [number, number]) => {
    const f = (x: number) => (Number.isInteger(x) ? `${x}` : x.toFixed(1).replace(/\.0$/, ''));
    return `${f(h[0])}–${f(h[1])} hrs`;
};
