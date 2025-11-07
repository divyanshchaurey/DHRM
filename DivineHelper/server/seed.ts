import { storage } from "./storage";

const quotes = [
  {
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    english: "You have the right to perform your duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
    source: "Bhagavad Gita, Chapter 2, Verse 47"
  },
  {
    sanskrit: "न जायते म्रियते वा कदाचित् नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥",
    english: "The soul is neither born, and nor does it die. It is unborn, eternal, everlasting, and primeval. It is not slain when the body is slain.",
    source: "Bhagavad Gita, Chapter 2, Verse 20"
  },
  {
    sanskrit: "यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता। योगिनो यतचित्तस्य युञ्जतो योगमात्मनः॥",
    english: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
    source: "Bhagavad Gita, Chapter 6, Verse 19"
  },
  {
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
    english: "Perform your duty equipoised, abandoning all attachment to success or failure. Such equanimity is called yoga.",
    source: "Bhagavad Gita, Chapter 2, Verse 48"
  },
  {
    sanskrit: "बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः। अनात्मनस्तु शत्रुत्वे वर्तेतात्मैव शत्रुवत्॥",
    english: "For those who have conquered the mind, it is their friend. For those who have failed to do so, the mind works like an enemy.",
    source: "Bhagavad Gita, Chapter 6, Verse 6"
  }
];

const books = [
  {
    title: "Bhagavad Gita",
    titleHi: "भगवद गीता",
    description: "The eternal dialogue between Lord Krishna and Arjuna on the battlefield of Kurukshetra.",
    descriptionHi: "कुरुक्षेत्र के युद्ध के मैदान में भगवान कृष्ण और अर्जुन के बीच शाश्वत संवाद।",
    content: `Chapter 1: Arjuna Vishada Yoga

On the battlefield of Kurukshetra, when Arjuna saw his kinsmen, teachers, and friends arrayed against him, he was overcome with grief and confusion. Laying down his bow, he turned to Lord Krishna for guidance.

"O Krishna, seeing my own people arrayed and eager for battle, my limbs fail me and my mouth is parched. My body trembles and my hair stands on end. How can I fight against those whom I should honor?"

Lord Krishna responded, "You grieve for those who should not be grieved for. The wise grieve neither for the living nor the dead. Never was there a time when I did not exist, nor you, nor these kings. Nor will there be a time when we shall cease to be."

Chapter 2: Sankhya Yoga

"You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.

Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga."

The soul is never born and never dies. It is unborn, eternal, everlasting, and primeval. It is not slain when the body is slain.

As a person sheds worn-out garments and wears new ones, likewise, at the time of death, the soul casts off its worn-out body and enters a new one.`
  },
  {
    title: "Upanishads",
    titleHi: "उपनिषद",
    description: "Ancient philosophical texts forming the theoretical basis for the Hindu religion.",
    descriptionHi: "प्राचीन दार्शनिक ग्रंथ जो हिंदू धर्म के लिए सैद्धांतिक आधार बनाते हैं।",
    content: `From the Mundaka Upanishad:

"Two birds, inseparable companions, perch on the same tree. One eats the fruit, the other looks on in detachment.

The first bird represents the individual self, caught in the pleasure and pain of the material world. The second bird is the Universal Self, watching without attachment.

When the first bird comes to know the second bird, it realizes its true nature and becomes free from all sorrow."

From the Chandogya Upanishad:

"In the beginning, there was only Being, one without a second. Some say there was only Non-being, one without a second. But how could Being come from Non-being?

In truth, there was only Being in the beginning, one without a second. Being thought, 'May I become many. May I grow forth.' Thus, it created fire.

The essence of all beings is That. That is Reality. That is the Self. Tat tvam asi - That thou art."`
  },
  {
    title: "Yoga Sutras",
    titleHi: "योग सूत्र",
    description: "Patanjali's classical text on the philosophy and practice of yoga.",
    descriptionHi: "योग के दर्शन और अभ्यास पर पतंजलि का शास्त्रीय ग्रंथ।",
    content: `Patanjali's Yoga Sutras - Book One: Samadhi Pada

Sutra 1.1: Now, the teachings of yoga begin.

Sutra 1.2: Yoga is the cessation of the fluctuations of the mind.

Sutra 1.3: Then the seer abides in its own true nature.

Sutra 1.12: Practice and non-attachment are the means to still the movements of consciousness.

Sutra 1.13: Practice is the effort to secure steadiness.

Sutra 1.14: This practice becomes firmly established when it has been cultivated for a long time, without interruption, and with sincere devotion.

Book Two: Sadhana Pada

Sutra 2.1: Yoga in practice is of three parts: discipline, self-study, and orientation toward the ideal of pure awareness.

Sutra 2.29: The eight limbs of yoga are: yama (moral restraints), niyama (observances), asana (posture), pranayama (breath control), pratyahara (sense withdrawal), dharana (concentration), dhyana (meditation), and samadhi (absorption).`
  }
];

export async function seedDatabase() {
  console.log("Starting database seed...");

  try {
    // Check if quotes already exist
    const existingQuotes = await storage.getQuotes();
    if (existingQuotes.length === 0) {
      console.log("Seeding quotes...");
      for (const quote of quotes) {
        await storage.createQuote(quote);
      }
      console.log(`Seeded ${quotes.length} quotes`);
    } else {
      console.log("Quotes already exist, skipping...");
    }

    // Check if books already exist
    const existingBooks = await storage.getBooks();
    if (existingBooks.length === 0) {
      console.log("Seeding books...");
      for (const book of books) {
        await storage.createBook(book);
      }
      console.log(`Seeded ${books.length} books`);
    } else {
      console.log("Books already exist, skipping...");
    }

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
