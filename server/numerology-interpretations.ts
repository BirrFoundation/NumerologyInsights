// Basic interpretations for when AI service is unavailable
export const basicInterpretations = {
  lifePath: (number: number) => {
    const meanings: Record<number, string> = {
      1: "As a natural born leader, you possess strong independence and ambition. Your pioneering spirit drives you to initiate new projects and lead others. You have exceptional creative abilities and original thinking that sets you apart.",
      2: "You are a natural mediator with diplomatic skills and deep sensitivity to others' needs. Your cooperative nature makes you an excellent team player and partner. You have a gift for bringing harmony to conflicting situations.",
      3: "Blessed with creative energy and expressive abilities, you're naturally optimistic and inspiring to others. Your artistic talents and communication skills help you share ideas effectively. You bring joy and enthusiasm to any situation.",
      4: "You are the embodiment of stability and reliability. Your practical approach and strong work ethic make you an excellent organizer and manager. You excel at creating solid foundations and seeing projects through to completion.",
      5: "Your adventurous spirit and versatility make you highly adaptable to change. You seek freedom and new experiences, making you an excellent problem solver and innovator. Your dynamic energy inspires others to embrace change.",
      6: "As a natural nurturer, you have a deep sense of responsibility and care for others. Your harmonious approach to life makes you an excellent counselor and advisor. You create beauty and comfort in your environment.",
      7: "Your analytical mind and spiritual awareness give you unique insights. You're naturally drawn to learning and understanding life's mysteries. Your introspective nature helps you discover profound truths.",
      8: "You possess natural leadership abilities in business and material affairs. Your drive for success is balanced with a strong sense of ethics. You have the potential to achieve significant material and spiritual abundance.",
      9: "Your humanitarian nature and universal understanding make you a compassionate leader. You inspire others through your selfless actions and broad perspective. You have a gift for helping others reach their potential.",
      11: "As a master number, you possess heightened intuition and spiritual awareness. Your inspirational abilities can lead to significant achievements in spiritual and creative pursuits. You have the potential to be a spiritual teacher.",
      22: "As a master builder number, you have exceptional potential to create lasting achievements. Your practical vision and ability to work with large-scale projects can lead to significant contributions to society."
    };
    return meanings[number] || "A unique number with special significance in your life path journey";
  },

  destiny: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your destiny calls you to be a pioneer and innovator. You have the natural ability to lead and inspire others through your original ideas and confident approach. Your path involves developing independence and creativity.",
      2: "You are destined to be a peace-maker and diplomat. Your natural ability to see multiple perspectives and create harmony makes you invaluable in partnerships and collaborations. You excel at bringing people together.",
      3: "Your destiny involves creative expression and inspiring communication. You have a natural talent for bringing joy and optimism to others through your artistic abilities and social skills. You're meant to share your creative gifts.",
      4: "You are destined to build lasting foundations and structures. Your practical wisdom and organizational abilities make you excellent at creating systems that endure. You bring order and stability to any situation.",
      5: "Your destiny involves bringing positive change and adventure to others. Your adaptable nature and love of freedom make you an excellent agent of transformation. You help others embrace change and growth.",
      6: "You are destined to be a guide and nurturer. Your responsible nature and ability to create harmony make you excellent at helping others grow and develop. You bring beauty and balance to people's lives.",
      7: "Your destiny involves seeking and sharing wisdom. Your analytical mind and spiritual awareness make you an excellent teacher and researcher. You help others understand life's deeper meanings.",
      8: "You are destined for material and spiritual mastery. Your natural business acumen and power make you excellent at creating abundance. You help others understand the balance of material and spiritual success.",
      9: "Your destiny is to serve humanity with compassion and wisdom. Your universal understanding and artistic abilities make you an inspiring teacher. You help others see their connection to the greater whole.",
      11: "As a master number, your destiny involves spiritual leadership and inspiration. You have the potential to be a powerful healer and teacher, helping others awaken to their spiritual nature.",
      22: "As a master builder number, your destiny involves creating large-scale improvements in the world. You have the potential to manifest significant projects that benefit humanity."
    };
    return meanings[number] || "A unique destiny number guiding you toward your life's purpose";
  },

  heartDesire: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your heart yearns for independence and leadership opportunities. You have a deep desire to create and pioneer new paths, seeking recognition for your unique contributions and innovative ideas.",
      2: "Your heart seeks harmony and meaningful partnerships. You deeply desire peace and cooperation in all your relationships, finding fulfillment in creating balance and understanding between people.",
      3: "Your heart yearns for creative expression and joyful connections. You have a deep desire to share your artistic gifts and bring happiness to others through your natural charm and creativity.",
      4: "Your heart seeks stability and order. You deeply desire to create reliable structures and systems, finding fulfillment in building solid foundations for yourself and others.",
      5: "Your heart yearns for freedom and adventure. You have a deep desire for varied experiences and positive change, seeking to explore life's many possibilities and share your discoveries.",
      6: "Your heart seeks to nurture and create harmony. You deeply desire to care for others and create beautiful environments, finding fulfillment in responsible service and family connections.",
      7: "Your heart yearns for wisdom and understanding. You have a deep desire to uncover life's mysteries and share your insights, seeking spiritual and intellectual growth.",
      8: "Your heart seeks material and spiritual abundance. You deeply desire success and recognition, finding fulfillment in achieving goals and creating prosperity for yourself and others.",
      9: "Your heart yearns to serve humanity. You have a deep desire to make a positive impact on the world, seeking to help others and contribute to universal understanding.",
      11: "Your heart seeks spiritual enlightenment and inspiration. You deeply desire to uplift others and share spiritual wisdom, finding fulfillment in awakening consciousness.",
      22: "Your heart yearns to create lasting achievements. You have a deep desire to build significant projects that benefit humanity, seeking to make a lasting impact on the world."
    };
    return meanings[number] || "Your heart's deep desires guide you toward meaningful experiences";
  },

  expression: (number: number) => {
    const meanings: Record<number, string> = {
      1: "You naturally express yourself through leadership and innovation. Your communication style is direct and original, inspiring others with your confident and creative approach to life.",
      2: "You express yourself through diplomacy and sensitivity. Your gentle and cooperative nature shines through in your interactions, helping create harmony and understanding.",
      3: "Your natural expression is creative and optimistic. You communicate with enthusiasm and artistic flair, bringing joy and inspiration to others through your words and actions.",
      4: "You express yourself through practical action and reliability. Your organized and methodical approach helps others feel secure and confident in your capabilities.",
      5: "Your expression is adventurous and adaptable. You communicate with versatility and enthusiasm, inspiring others to embrace change and explore new possibilities.",
      6: "You naturally express care and responsibility. Your nurturing approach and sense of harmony come through in all your interactions, creating comfort and trust.",
      7: "You express yourself through wisdom and analysis. Your thoughtful and introspective nature brings depth to your communications, helping others understand complex ideas.",
      8: "Your expression shows authority and capability. You communicate with confidence and power, demonstrating your ability to achieve goals and create success.",
      9: "You express universal love and artistic wisdom. Your compassionate and sophisticated approach helps others see the bigger picture and their role in it.",
      11: "You express spiritual insight and inspiration. Your elevated consciousness comes through in your communications, helping others connect with higher wisdom.",
      22: "You express mastery and practical vision. Your ability to see the big picture and create practical solutions comes through in your interactions."
    };
    return meanings[number] || "Your unique expression reveals your authentic self to the world";
  },

  personality: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your outer personality radiates confidence and independence. Others see you as a natural leader with original ideas and the courage to forge new paths. You appear innovative and self-reliant.",
      2: "You come across as diplomatic and understanding. Others perceive your gentle strength and ability to create harmony. You appear cooperative and sensitive to others' needs.",
      3: "Your personality sparkles with creativity and sociability. Others see your natural charm and artistic abilities. You appear optimistic and capable of bringing joy to any situation.",
      4: "You present yourself as reliable and organized. Others recognize your practical wisdom and steady approach. You appear trustworthy and capable of handling responsibilities.",
      5: "Your personality exudes adaptability and enthusiasm. Others see your adventurous spirit and love of freedom. You appear dynamic and ready for new experiences.",
      6: "You come across as nurturing and responsible. Others recognize your caring nature and ability to create harmony. You appear capable of handling family and community responsibilities.",
      7: "Your personality reflects wisdom and mystery. Others see your analytical mind and spiritual depth. You appear thoughtful and capable of deep understanding.",
      8: "You present yourself as confident and capable. Others recognize your executive ability and potential for success. You appear able to achieve significant goals.",
      9: "Your personality radiates universal understanding. Others see your humanitarian nature and artistic sensitivity. You appear wise and compassionate.",
      11: "You come across as inspired and enlightened. Others sense your spiritual awareness and intuitive abilities. You appear capable of providing spiritual guidance.",
      22: "Your personality reflects practical mastery. Others recognize your ability to achieve great things. You appear capable of creating significant positive change."
    };
    return meanings[number] || "Your unique personality makes a distinct impression on others";
  },

  attribute: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your core attribute is leadership and originality. You have natural abilities in pioneering new paths and inspiring others through your innovative thinking and independent action.",
      2: "Your core attribute is diplomacy and cooperation. You excel at creating harmony and understanding between people, with natural abilities in partnership and mediation.",
      3: "Your core attribute is creativity and expression. You have natural abilities in artistic endeavors and communication, bringing joy and inspiration to others.",
      4: "Your core attribute is organization and reliability. You excel at creating stable foundations and managing practical matters with natural abilities in systematic thinking.",
      5: "Your core attribute is adaptability and freedom. You have natural abilities in embracing change and exploring new possibilities, bringing excitement and variety to life.",
      6: "Your core attribute is nurturing and responsibility. You excel at creating harmony and taking care of others, with natural abilities in counseling and guidance.",
      7: "Your core attribute is wisdom and analysis. You have natural abilities in understanding complex matters and seeking deeper truth, bringing insight to situations.",
      8: "Your core attribute is achievement and authority. You excel at managing resources and creating success, with natural abilities in leadership and business.",
      9: "Your core attribute is compassion and universal understanding. You have natural abilities in helping others and seeing the bigger picture of life.",
      11: "Your core attribute is spiritual insight and inspiration. You excel at understanding and sharing higher wisdom, with natural abilities in intuitive guidance.",
      22: "Your core attribute is practical vision and manifestation. You have natural abilities in creating large-scale improvements and bringing ideas into reality."
    };
    return meanings[number] || "Your core attributes reveal your natural talents and abilities";
  },

  getBasicInterpretation: (numbers: { 
    lifePath: number;
    destiny: number;
    heartDesire: number;
    expression: number;
    personality: number;
    attribute: number;
  }) => {
    return {
      lifePath: basicInterpretations.lifePath(numbers.lifePath),
      destiny: basicInterpretations.destiny(numbers.destiny),
      heartDesire: basicInterpretations.heartDesire(numbers.heartDesire),
      expression: basicInterpretations.expression(numbers.expression),
      personality: basicInterpretations.personality(numbers.personality),
      attribute: basicInterpretations.attribute(numbers.attribute),
      overview: `Your Life Path ${numbers.lifePath} reveals your life's purpose and the lessons you're here to learn. Your Destiny number ${numbers.destiny} shows your potential and the goals you're meant to achieve. Your Heart's Desire ${numbers.heartDesire} indicates your inner motivation and what truly makes you happy. Your Expression number ${numbers.expression} reveals how you share yourself with the world, while your Personality number ${numbers.personality} shows how others perceive you. Your Attribute number ${numbers.attribute} highlights your natural talents and core characteristics that help you achieve your goals.`
    };
  }
};