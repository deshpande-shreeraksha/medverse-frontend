// Shared hospitals data - used by Hospitals.js and HospitalCity.js
import apolloBng from '../assets/apollo-bng.jpeg';
import manipalBng from '../assets/manipal-bng.jpg';
import fortisBng from '../assets/fortis-bng.jpg';
import columbiaBng from '../assets/columbia-bng.jpeg';
import apolloBgs from '../assets/apollo-bgs.jpg';
import manipalGoa from '../assets/manipal-goa.jpg';
import kmc from '../assets/kmc.jpeg';
import  aj from '../assets/aj.jpeg';
import goamed from '../assets/goa-medical.jpg';
import aiims from '../assets/aims.jpeg';
import fortisDelhi from '../assets/fortis-delhi.jpg'
import hospitalBg from '../assets/hospital-bg.jpg'
export const hospitalsData = {
  bengaluru: [
    {
      id: 1,
      name: "Apollo Hospitals Bengaluru",
      image: apolloBng,
      address: "154/11, Bannerghatta Road, Opposite IIM-B, Bengaluru, Karnataka 560076",
      contact: "+91-80-2630-4050",
      description: "Multi-specialty hospital with advanced medical facilities."
    },
    {
      id: 2,
      name: "Manipal Hospital Old Airport Road",
      image: manipalBng,
      address: "98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017",
      contact: "+91-80-2502-4444",
      description: "Leading healthcare provider with state-of-the-art technology."
    },
    {
      id: 3,
      name: "Fortis Hospital Cunningham Road",
      image: fortisBng,
      address: "14, Cunningham Road, Bengaluru, Karnataka 560052",
      contact: "+91-80-4199-4444",
      description: "Comprehensive medical care with expert doctors."
    }
  ],
  mysuru: [
    {
      id: 4,
      name: "Columbia Asia Hospital Mysuru",
      image: columbiaBng,
      address: "No. 85-86, Bangalore-Mysore Ring Road Junction, Bannimantap, Mysuru, Karnataka 570015",
      contact: "+91-821-424-4444",
      description: "Modern healthcare facility serving Mysuru region."
    },
    {
      id: 5,
      name: "Apollo BGS Hospitals",
      image: apolloBgs,
      address: "Adichunchanagiri Road, Kuvempunagar, Mysuru, Karnataka 570023",
      contact: "+91-821-256-7777",
      description: "Trusted hospital with comprehensive medical services."
    }
  ],
  mangaluru: [
    {
      id: 6,
      name: "KMC Hospital Mangaluru",
      image: kmc,
      address: "Dr. B R Ambedkar Circle, Mangaluru, Karnataka 575001",
      contact: "+91-824-244-4444",
      description: "Educational and medical excellence in Mangaluru."
    },
    {
      id: 7,
      name: "A.J. Hospital & Research Centre",
      image:aj,
      address: "Kuntikana, Mangaluru, Karnataka 575004",
      contact: "+91-824-222-5533",
      description: "Advanced healthcare with research focus."
    }
  ],
  goa: [
    {
      id: 8,
      name: "Manipal Hospitals Goa",
      image: manipalGoa,
      address: "Dr. E Borges Road, Dona Paula, Panaji, Goa 403004",
      contact: "+91-832-664-4444",
      description: "Quality healthcare in the heart of Goa."
    },
    {
      id: 9,
      name: "Goa Medical College",
      image: goamed,
      address: "Bambolim, Tiswadi, Goa 403202",
      contact: "+91-832-245-8747",
      description: "Government medical college and hospital."
    }
  ],
  delhi: [
    {
      id: 10,
      name: "AIIMS Delhi",
      image: aiims,
      address: "Ansari Nagar, New Delhi, Delhi 110029",
      contact: "+91-11-2658-8500",
      description: "Premier medical institution in India."
    },
    {
      id: 11,
      name: "Max Super Speciality Hospital",
      image: hospitalBg,
      address: "1,2, Press Enclave Road, Saket, New Delhi, Delhi 110017",
      contact: "+91-11-2651-5050",
      description: "World-class healthcare services."
    },
    {
      id: 12,
      name: "Fortis Escorts Heart Institute",
      image: fortisDelhi,
      address: "Okhla Road, New Delhi, Delhi 110025",
      contact: "+91-11-4713-5000",
      description: "Specialized cardiac care center."
    }
  ],
  gurugram: [
    {
      id: 13,
      name: "Medanta - The Medicity",
      image: hospitalBg,
      address: "CH Baktawar Singh Rd, Sector 38, Gurugram, Haryana 122001",
      contact: "+91-124-414-1414",
      description: "Multi-super specialty hospital."
    },
    {
      id: 14,
      name: "Fortis Memorial Research Institute",
      image: hospitalBg,
      address: "Sector - 44, Opposite HUDA City Centre, Gurugram, Haryana 122002",
      contact: "+91-124-496-2200",
      description: "Advanced medical research and care."
    }
  ],
  pune: [
    {
      id: 15,
      name: "Ruby Hall Clinic",
      image: hospitalBg,
      address: "40, Sassoon Road, Pune, Maharashtra 411001",
      contact: "+91-20-2616-3333",
      description: "Pioneering healthcare in Pune."
    },
    {
      id: 16,
      name: "Sahyadri Hospitals",
      image: hospitalBg,
      address: "Plot No. 30-C, Erandwane, Karve Rd, Pune, Maharashtra 411004",
      contact: "+91-20-6721-3000",
      description: "Chain of multi-specialty hospitals."
    },
    {
      id: 17,
      name: "Jehangir Hospital",
      image: hospitalBg,
      address: "32, Sassoon Road, Pune, Maharashtra 411001",
      contact: "+91-20-6681-9999",
      description: "Trusted healthcare provider since 1946."
    }
  ],
  kolkata: [
    {
      id: 18,
      name: "Apollo Gleneagles Hospitals",
      image: hospitalBg,
      address: "58, Canal Circular Road, Kolkata, West Bengal 700054",
      contact: "+91-33-2320-3040",
      description: "Multi-specialty hospital in Kolkata."
    },
    {
      id: 19,
      name: "AMRI Hospitals",
      image: hospitalBg,
      address: "230, Barakhola Lane, Purba Jadavpur, Kolkata, West Bengal 700099",
      contact: "+91-33-6680-0000",
      description: "Advanced medical research institute."
    }
  ],
  jaipur: [
    {
      id: 20,
      name: "Santokba Durlabhji Memorial Hospital",
      image: hospitalBg,
      address: "Near Rambagh Circle, Bhawani Singh Road, Jaipur, Rajasthan 302015",
      contact: "+91-141-2566-229",
      description: "Leading hospital in Jaipur."
    },
    {
      id: 21,
      name: "Fortis Escorts Hospital Jaipur",
      image: hospitalBg,
      address: "Jawaharlal Nehru Marg, Malviya Nagar, Jaipur, Rajasthan 302017",
      contact: "+91-141-2547-000",
      description: "Comprehensive healthcare services."
    }
  ],
  vijayawada: [
    {
      id: 22,
      name: "Andhra Hospitals",
      image: hospitalBg,
      address: "Currency Nagar, Vijayawada, Andhra Pradesh 520008",
      contact: "+91-866-243-4444",
      description: "Multi-specialty hospital in Vijayawada."
    },
    {
      id: 23,
      name: "Manipal Hospital Vijayawada",
      image: hospitalBg,
      address: "Chuttugunta, Ring Road, Vijayawada, Andhra Pradesh 520002",
      contact: "+91-866-676-7777",
      description: "Quality healthcare with modern facilities."
    }
  ]
};
