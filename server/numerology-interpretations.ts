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

  personalDevelopment: (numbers: {
    lifePath: number;
    destiny: number;
    heartDesire: number;
    expression: number;
    personality: number;
    attribute: number;
  }) => {
    const recommendations = {
      strengths: [] as string[],
      challenges: [] as string[],
      growthAreas: [] as string[],
      practices: [] as string[]
    };

    // Life Path Based Recommendations
    switch (numbers.lifePath) {
      case 1:
        recommendations.strengths.push("Natural leadership abilities");
        recommendations.challenges.push("May struggle with being too independent");
        recommendations.growthAreas.push("Develop patience and collaboration skills");
        recommendations.practices.push("Practice active listening and team-building exercises");
        break;
      case 2:
        recommendations.strengths.push("Natural diplomatic abilities");
        recommendations.challenges.push("May avoid necessary confrontation");
        recommendations.growthAreas.push("Develop assertiveness while maintaining harmony");
        recommendations.practices.push("Practice setting healthy boundaries while remaining cooperative");
        break;
      case 3:
        recommendations.strengths.push("Creative and expressive talents");
        recommendations.challenges.push("May scatter energy across too many projects");
        recommendations.growthAreas.push("Develop focus and follow-through");
        recommendations.practices.push("Keep a creativity journal and set project completion goals");
        break;
      case 4:
        recommendations.strengths.push("Strong organizational abilities");
        recommendations.challenges.push("May become too rigid or inflexible");
        recommendations.growthAreas.push("Develop adaptability and spontaneity");
        recommendations.practices.push("Try new approaches to familiar tasks regularly");
        break;
      case 5:
        recommendations.strengths.push("Adaptability and quick learning");
        recommendations.challenges.push("May resist commitment or routine");
        recommendations.growthAreas.push("Develop stability while maintaining freedom");
        recommendations.practices.push("Create flexible routines that allow for variety");
        break;
      case 6:
        recommendations.strengths.push("Natural caregiving abilities");
        recommendations.challenges.push("May take on too much responsibility for others");
        recommendations.growthAreas.push("Develop healthy boundaries in relationships");
        recommendations.practices.push("Practice self-care and delegating responsibilities");
        break;
      case 7:
        recommendations.strengths.push("Deep analytical abilities");
        recommendations.challenges.push("May become too isolated or withdrawn");
        recommendations.growthAreas.push("Develop balance between solitude and connection");
        recommendations.practices.push("Schedule regular social activities while maintaining study time");
        break;
      case 8:
        recommendations.strengths.push("Natural business acumen");
        recommendations.challenges.push("May focus too much on material success");
        recommendations.growthAreas.push("Develop balance between material and spiritual goals");
        recommendations.practices.push("Practice mindfulness and charitable giving");
        break;
      case 9:
        recommendations.strengths.push("Natural humanitarian instincts");
        recommendations.challenges.push("May sacrifice personal needs for others");
        recommendations.growthAreas.push("Develop healthy self-interest while serving others");
        recommendations.practices.push("Set personal goals alongside service activities");
        break;
      case 11:
        recommendations.strengths.push("Spiritual insight and inspiration");
        recommendations.challenges.push("May struggle with practical matters");
        recommendations.growthAreas.push("Develop grounding while maintaining inspiration");
        recommendations.practices.push("Combine spiritual practices with practical goal-setting");
        break;
      case 22:
        recommendations.strengths.push("Visionary building abilities");
        recommendations.challenges.push("May feel overwhelmed by potential");
        recommendations.growthAreas.push("Develop step-by-step implementation skills");
        recommendations.practices.push("Break large visions into manageable projects");
        break;
    }

    // Add Expression Number Insights
    recommendations.growthAreas.push(
      `Based on your Expression number ${numbers.expression}, focus on ${
        numbers.expression === 1 ? "leadership development" :
          numbers.expression === 2 ? "relationship building" :
            numbers.expression === 3 ? "creative expression" :
              numbers.expression === 4 ? "system building" :
                numbers.expression === 5 ? "adaptability training" :
                  numbers.expression === 6 ? "counseling skills" :
                    numbers.expression === 7 ? "research and analysis" :
                      numbers.expression === 8 ? "business development" :
                        numbers.expression === 9 ? "humanitarian work" :
                          numbers.expression === 11 ? "spiritual teaching" :
                            "manifesting visions" // 22
      }`
    );

    // Add Personality Number Suggestions
    recommendations.practices.push(
      `Enhance your ${numbers.personality} personality energy by ${
        numbers.personality === 1 ? "taking leadership roles in groups" :
          numbers.personality === 2 ? "mediating conflicts" :
            numbers.personality === 3 ? "public speaking" :
              numbers.personality === 4 ? "organizing events" :
                numbers.personality === 5 ? "teaching adaptability skills" :
                  numbers.personality === 6 ? "counseling others" :
                    numbers.personality === 7 ? "writing or teaching" :
                      numbers.personality === 8 ? "mentoring in business" :
                        numbers.personality === 9 ? "volunteering" :
                          numbers.personality === 11 ? "spiritual counseling" :
                            "project management" // 22
      }`
    );

    return {
      recommendations,
      summary: `Focus on developing your ${numbers.lifePath} Life Path strengths while being mindful of potential challenges. Your Expression number ${numbers.expression} suggests natural talents in ${
        numbers.expression === 1 ? "leadership and innovation" :
          numbers.expression === 2 ? "diplomacy and cooperation" :
            numbers.expression === 3 ? "creativity and communication" :
              numbers.expression === 4 ? "organization and stability" :
                numbers.expression === 5 ? "freedom and adaptability" :
                  numbers.expression === 6 ? "nurturing and responsibility" :
                    numbers.expression === 7 ? "analysis and wisdom" :
                      numbers.expression === 8 ? "business and achievement" :
                        numbers.expression === 9 ? "humanitarian service" :
                          numbers.expression === 11 ? "spiritual inspiration" :
                            "practical manifestation" // 22
      }. Use these gifts in your personal development journey.`
    };
  },

  getBasicInterpretation: (numbers: {
    lifePath: number;
    destiny: number;
    heartDesire: number;
    expression: number;
    personality: number;
    attribute: number;
  }) => {
    const personalDev = basicInterpretations.personalDevelopment(numbers);

    return {
      lifePath: basicInterpretations.lifePath(numbers.lifePath),
      destiny: basicInterpretations.destiny(numbers.destiny),
      heartDesire: basicInterpretations.heartDesire(numbers.heartDesire),
      expression: basicInterpretations.expression(numbers.expression),
      personality: basicInterpretations.personality(numbers.personality),
      attribute: basicInterpretations.attribute(numbers.attribute),
      overview: `Your Life Path ${numbers.lifePath} reveals your life's purpose and the lessons you're here to learn. Your Destiny number ${numbers.destiny} shows your potential and the goals you're meant to achieve. Your Heart's Desire ${numbers.heartDesire} indicates your inner motivation and what truly makes you happy. Your Expression number ${numbers.expression} reveals how you share yourself with the world, while your Personality number ${numbers.personality} shows how others perceive you. Your Attribute number ${numbers.attribute} highlights your natural talents and core characteristics that help you achieve your goals.`,
      recommendations: personalDev.recommendations,
      developmentSummary: personalDev.summary
    };
  }
};