export type LineKey = 'purple' | 'green' | 'yellow'

export const LINES: Record<LineKey, string[]> = {
  purple: [
    'Challaghatta', 'Kengeri', 'Kengeri Bus Terminal', 'Pattanagere',
    'Jnana Bharathi', 'Rajarajeshwari Nagar', 'Panchamukhi / Nayandahalli',
    'Mysuru Road', 'Deepanjali Nagar', 'Attiguppe', 'Vijayanagar', 'Hosahalli',
    'Magadi Road', 'Kempegowda Station (Majestic)',
    'Sir M Visvesvaraya Station, Central College', 'Vidhana Soudha',
    'Cubbon Park', 'Dr B R Ambedkar Station, Vidhana Soudha',
    'Mahatma Gandhi Road', 'Trinity', 'Halasuru', 'Indiranagar',
    'Swami Vivekananda Road', 'Baiyappanahalli', 'Benniganahalli', 'K R Pura',
    'Singayyanapalya', 'Garudacharapalya', 'Hoodi', 'Seetharampalya',
    'Kundalahalli', 'Nallurhalli', 'Sri Sathya Sai Hospital',
    'Pattandur Agrahara', 'Kadugodi Tree Park', 'Hopefarm Channasandra',
    'Whitefield (Kadugodi)',
  ],
  green: [
    'Madavara', 'Chikkabidarakallu', 'Manjunath Nagar', 'Dasarahalli',
    'Jalahalli', 'Peenya Industry', 'Peenya', 'Goraguntepalya', 'Yeshwanthpur',
    'Sandal Soap Factory', 'Mahalakshmi', 'Rajajinagar',
    'Mahakavi Kuvempu Road', 'Srirampura', 'Sampige Road',
    'Kempegowda Station (Majestic)', 'Chickpete', 'Krishna Rajendra Market',
    'National College', 'Lalbagh', 'South End Circle', 'Jayanagar',
    'Rashtreeya Vidyalaya Road', 'Banashankari', 'Jaya Prakash Nagar',
    'Yelachenahalli', 'Konanakunte Cross', 'Doddakallasandra', 'Vajarahalli',
    'Thalaghattapura', 'Silk Institute',
  ],
  yellow: [
    'Rashtreeya Vidyalaya Road', 'Ragigudda', 'Jayadeva Hospital',
    'BTM Layout', 'Central Silk Board', 'Bommanahalli', 'Hongasandra',
    'Kudlu Gate', 'Singasandra', 'Hosa Road', 'Beratena Agrahara',
    'Electronic City', 'Infosys Foundation Konappana Agrahara', 'Huskur Road',
    'Hebbagodi', 'Bommasandra',
  ],
}

export const LINE_COLORS: Record<LineKey, { bg: string; border: string; text: string; dot: string }> = {
  purple: { bg: 'var(--purple-bg)', border: 'var(--purple-border)', text: 'var(--purple-ll)', dot: 'var(--purple-l)' },
  green:  { bg: 'var(--green-bg)',  border: 'var(--green-border)',  text: 'var(--green-ll)',  dot: 'var(--green-l)'  },
  yellow: { bg: 'var(--yellow-bg)', border: 'var(--yellow-border)', text: 'var(--yellow-ll)', dot: 'var(--yellow-l)' },
}

// Interchange stations
export const MAJESTIC = 'Kempegowda Station (Majestic)'
export const RV_ROAD  = 'Rashtreeya Vidyalaya Road'
