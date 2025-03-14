// Basic interpretations for numerology and zodiac signs
// Define zodiac types
export type ZodiacSign = 'Rat' | 'Ox' | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake' | 'Horse' | 'Sheep' | 'Monkey' | 'Rooster' | 'Dog' | 'Pig';

export type ZodiacInterp = {
  traits: string[];
  characteristics: string;
  compatibility: {
    best: string;
    worst: string;
    description: string;
  };
};

// Define interpretations
export const basicInterpretations = {
  lifePath: (number: number) => {
    const meanings: Record<number, string> = {
      1: "As embodying masculine energy, You are a natural born leader, you possess strong independence and ambition. Your pioneering spirit drives you to initiate new projects and lead others. You have exceptional creative abilities and original thinking that sets you apart. In relationships, you seek partners who respect your independence while supporting your vision. Career-wise, you excel in entrepreneurial ventures, leadership positions, and innovative fields. Your challenge lies in balancing self-reliance with collaboration, and learning to listen to others' perspectives. Your greatest opportunities come when you embrace your natural leadership abilities while remaining open to input from others. You can be egoistic, stubborn, and stiff which makes relationship a big challenge.",
      2: "As embodying feminine energy, You are a natural mediator with diplomatic skills and deep sensitivity to others' needs. Your cooperative nature makes you an excellent team player and partner. You have a rare gift for bringing harmony to conflicting situations. In relationships, you excel at creating deep, meaningful connections and understanding unspoken emotions. Your career path often involves bringing people together, whether through counseling, team coordination, or partnership-based ventures. Your challenge is to maintain healthy boundaries while serving others, and to speak up for your own needs. Your greatest opportunities arise when you balance your natural diplomacy with assertiveness. You are emotionally sensitive which makes relationship difficult because you get hurt easily. ",
      3: "Blessed with creative energy, communication and expressive abilities, you're naturally optimistic and inspiring to others. Your artistic talents and communication skills help you share ideas effectively. You bring joy and enthusiasm to any situation. In relationships, you're charming and engaging, able to express deep emotions through creative means. Career-wise, you thrive in creative fields, public speaking, and entertainment. Your challenge is to focus your abundant creative energy and follow through on projects. Your greatest opportunities come when you channel your creativity into structured, meaningful endeavors that benefit others. You are not focused and your energy is scattered which makes it hard for you to finish what you started.",
      4: "You are the embodiment of stability, reliability and discipline. Your practical approach and strong work ethic make you an excellent organizer and manager. You excel at creating solid foundations and seeing projects through to completion. In relationships, you offer steadfast loyalty and practical support. Your career path often involves building lasting structures, whether physical or organizational. Your challenge is to remain flexible and open to change while maintaining your stable nature. Your greatest opportunities arise when you combine your practical skills with innovative thinking. You can be as OCD sometimes and try to calm yourself down.",
      5: "Your adventurous spirit and versatility make you highly adaptable to change. You seek freedom and new experiences, making you an excellent problem solver and innovator. Your dynamic energy inspires others to embrace change. In relationships, you bring excitement and variety, though you need partners who understand your need for freedom. Career-wise, you excel in fields requiring adaptability and quick thinking. Your challenge is to find stability within change and commit to long-term goals. Your greatest opportunities come when you channel your adaptable nature into progressive, sustainable ventures. You are prone to be addicted to things you like.",
      6: "As a natural nurturer, you have a deep sense of responsibility and care for others specially family. Your harmonious approach to life makes you an excellent counselor and advisor. You create beauty and comfort in your environment. In relationships, you're deeply committed and nurturing, often serving as the family anchor. Your career path often involves helping professions, teaching, or creative fields focused on beauty and harmony. Your challenge is to avoid taking on too much responsibility for others' well-being. Your greatest opportunities arise when you balance your nurturing nature with self-care. You tend to get hurt yourself trying to make life easier for loved ones.",
      7: "Your analytical mind and spiritual awareness give you unique insights. You're naturally drawn to learning and understanding life's mysteries. Your introspective nature helps you discover profound truths. In relationships, you seek deep, meaningful connections with those who understand your need for solitude and contemplation. Career-wise, you excel in research, analysis, spiritual studies, or technological fields. Your challenge is to bridge the gap between your inner wisdom and practical application. Your greatest opportunities come when you share your insights while maintaining your sacred space. You like to boast about your knowledge which tend to make you egoistic.",
      8: "You possess natural leadership abilities in business and material affairs/or not because 8 is infinity which can mean completely opposite on anything, plus its a strong karmic number which makes life a rubber band effect, anything given comes right back. Your drive for success is balanced with a strong sense of ethics. You have the potential to achieve significant material and spiritual abundance/or not. In relationships, you seek partners who understand your ambition and share your values. Your career path often involves executive leadership/ or not, financial management, or large-scale project direction. Your challenge is to maintain spiritual and emotional balance while pursuing material success due to high karmic energy. Your greatest opportunities arise when you use your power to benefit others while achieving personal success. You have difficulties letting go of the past so you tend to try to win every situation by bringing the past which makes relationships toxic. ",
      9: "Your humanitarian nature and universal understanding make you a compassionate leader with mirroring personality. You inspire others through your selfless actions and broad perspective. You have a gift for helping others reach their potential. In relationships, you bring depth, wisdom, and universal love. Your career path often involves humanitarian work, teaching, or creative endeavors that benefit humanity. Your challenge is to complete personal cycles while maintaining boundaries in service to others. Your greatest opportunities come when you embrace your role as a wisdom keeper and guide for others. you tend to get hurt because you find your self trying to help others and get into their business unnecessarily",
      11: "As a master number, old soul, magnetic and charismatic personality you possess heightened intuition and spiritual awareness. Your inspirational abilities can lead to significant achievements in spiritual and creative pursuits. You have the potential to be a spiritual teacher. In relationships, you bring deep understanding and inspiration, though you may sometimes feel misunderstood. Career-wise, you excel in spiritual counseling, teaching, or innovative creative fields. Your challenge is to ground your spiritual insights into practical application. Your greatest opportunities arise when you embrace your role as a spiritual guide while maintaining everyday responsibilities. You are emotionally sensitive which leads you into misunderstandings and conflicts.",
      22: "As a master builder number, you have exceptional potential to create lasting achievements. Your practical vision and ability to work with large-scale projects can lead to significant contributions to society. In relationships, you seek partners who understand your grand vision and support your ambitious goals. Your career path often involves large-scale projects that benefit many people. Your challenge is to manifest your expansive visions while attending to practical details. Your greatest opportunities come when you fully embrace your ability to transform dreams into reality on a grand scale. You can easily neglect most important aspects in life, be mindful.", 
      33: "As a master number, you embody selfless love, deep compassion, and spiritual enlightenment. You have a rare gift for uplifting others through your wisdom, creativity, and nurturing energy. People are naturally drawn to your presence because of your ability to inspire and heal. In relationships, you give unconditional love and tend to sacrifice your own needs for the happiness of others. Your career path often involves teaching, spiritual counseling, healing professions, or any role that allows you to serve humanity on a deep level. Your challenge is to set healthy boundaries and not lose yourself in the service of others. You tend to take on too much responsibility, which can lead to emotional and physical exhaustion. Your greatest opportunities come when you balance your selfless nature with self-care and embrace your role as a guiding light for others. You struggle with perfectionism, and your high expectations of yourself and others can lead to disappointment. Learning to let go and trust the process will help you fulfill your higher purpose.",
      44: "You possess extraordinary potential for discipline, stability, and grounded wisdom. Unlike 22, which builds large visions, 44 is more about execution, structure, and real-world mastery. You are practical, methodical, and capable of creating solid, tangible success through persistence and patience. But since you possess karma it can be completly oposite too. You have a strong sense of responsibility and thrive in positions that require leadership, problem-solving, and long-term planning. In relationships, you seek loyalty and security, often taking on the role of protector or provider. However, your serious nature can sometimes make you emotionally distant or rigid. Your career path is often tied to entrepreneurship, engineering, finance, real estate, or any field that requires long-term vision and commitment. Your challenge is to avoid getting too caught up in work and material success, neglecting personal fulfillment and relationships. You tend to carry the burdens of others, often feeling responsible for things beyond your control. Your greatest opportunities arise when you learn to balance work with emotional well-being, ensuring that your achievements also bring you inner peace. You have a tendency to be skeptical of anything spiritual or abstract, which can limit your perspective.",
      28: "You are a natural leader with a strong presence and the ability to command authority. You possess a rare blend of independence, ambition, and charisma, making you highly influential. People often see you as confident, resourceful, and capable of handling any situation. Your energy is dynamic, and you thrive in roles that allow you to take charge, make decisions, and lead others toward success. In relationships, you are passionate and loyal, but you have a strong need for control, which can create power struggles. You attract partners who admire your strength but may struggle with your dominant nature. Your career path often involves business, law, politics, leadership roles, or any field where you can strategically build success and wealth. Your challenge is to balance power with humility and not let ambition turn into arrogance. You can sometimes be too focused on material success, neglecting the emotional and spiritual aspects of life. Your greatest opportunities come when you use your influence for the greater good rather than purely personal gain. You can be impatient, and when things don’t go as planned, you may struggle with frustration. Learning to adapt and trust divine timing will help you reach your full potential."
    };
    return meanings[number] || "A unique number with special significance in your life path journey";
  },

  destiny: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your destiny calls you to be a pioneer and innovator. You have the natural ability to lead and inspire others through your original ideas and confident approach. Your path involves developing independence and creativity. Professionally, you're meant to break new ground and initiate new ventures. Your destiny requires you to develop strong willpower, self-confidence, and the courage to stand alone when necessary. You're here to learn leadership through innovation, requiring you to balance assertiveness with cooperation. The universe guides you toward positions where your originality can inspire and lead others to new possibilities. Watch for opportunities that allow you to express your unique vision and take charge of new initiatives. You are destined to be a leader, paving your own path with confidence and innovation. Independence and ambition drive you to take charge in any situation. You naturally attract authority and responsibility, excelling in careers that require vision and bold decision-making. Your challenge is to temper your assertiveness with collaboration and avoid becoming too self-centered",
      2: "You are destined to be a peace-maker and diplomat. Your natural ability to see multiple perspectives and create harmony makes you invaluable in partnerships and collaborations. You excel at bringing people together. Your professional path often involves mediation, cooperation, and supporting roles that are crucial for success. Your destiny requires developing deep emotional intelligence and intuitive understanding of others. You're here to learn the power of patience, subtle influence, and the art of cooperation. The universe guides you toward situations where your diplomatic skills can heal divisions and create unity. Pay attention to opportunities that allow you to work in partnership and bring harmony to tense situations. Your destiny is to bring harmony, peace, and cooperation. You thrive in partnerships and excel in diplomatic roles. You have a deep understanding of relationships and emotional intelligence. Your challenge is to assert yourself when needed and not let others take advantage of your kindness.",
      3: "Your destiny involves creative expression and inspiring communication. You have a natural talent for bringing joy and optimism to others through your artistic abilities and social skills. You're meant to share your creative gifts. Professionally, you're drawn to fields that allow you to express, entertain, and uplift others. Your destiny requires developing your creative talents and learning to communicate effectively. You're here to learn the power of positive self-expression and the impact of words. The universe guides you toward opportunities where your creative voice can inspire and enlighten others. Watch for chances to share your artistic gifts and communicate important messages. You are meant to inspire through communication, creativity, and self-expression. Your destiny involves sharing joy, art, or storytelling with the world. You have an innate charm and optimism that draws people to you. Your challenge is to focus your energy and avoid superficiality.",
      4: "You are destined to build lasting foundations and structures. Your practical wisdom and organizational abilities make you excellent at creating systems that endure. You bring order and stability to any situation. Your professional path involves creating reliable systems, maintaining stability, and ensuring quality. Your destiny requires developing discipline, practicality, and attention to detail. You're here to learn the value of hard work and the importance of creating solid foundations. The universe guides you toward opportunities where your organizational skills can create lasting impact. Pay attention to situations that require establishing order from chaos. Your destiny is to build stability and create solid foundations. You are hardworking, practical, and disciplined, excelling in structured environments. You are destined to leave a lasting impact through persistence and effort. Your challenge is to remain adaptable and open to new approaches.",
      5: "Your destiny involves bringing positive change and adventure to others. Your adaptable nature and love of freedom make you an excellent agent of transformation. You help others embrace change and growth. Professionally, you're meant to be a catalyst for progress and innovation. Your destiny requires developing versatility and the courage to embrace change. You're here to learn the value of freedom and the responsible use of change. The universe guides you toward opportunities where your progressive thinking can lead to meaningful transformations. Watch for chances to introduce new methods and progressive ideas. Your destiny involves adventure, freedom, and versatility. You are meant to experience different cultures, ideas, and lifestyles. Change is a constant in your life, and you thrive when embracing the unknown. Your challenge is to find direction and avoid being restless or reckless.",
      6: "You are destined to be a guide and nurturer. Your responsible nature and ability to create harmony make you excellent at helping others grow and develop. You bring beauty and balance to people's lives. Your professional path often involves counseling, teaching, or creating nurturing environments. Your destiny requires developing deep understanding of human nature and the ability to provide guidance with love. You're here to learn the balance between responsibility and personal freedom. The universe guides you toward opportunities where your nurturing abilities can foster growth in others. Pay attention to situations where you can create harmony and beauty. You are destined to nurture, support, and bring balance to those around you. You excel in caregiving, artistic, and domestic roles. Your path often involves family, community service, and responsibility. Your challenge is to avoid overextending yourself and maintain personal boundaries.",
      7: "Your destiny involves seeking and sharing wisdom. Your analytical mind and spiritual awareness make you an excellent teacher and researcher. You help others understand life's deeper meanings. Professionally, you're drawn to fields requiring deep analysis and spiritual understanding. Your destiny requires developing both intellectual and spiritual wisdom. You're here to learn the integration of practical knowledge with spiritual truth. The universe guides you toward opportunities where your wisdom can illuminate complex subjects. Watch for chances to delve deeply into subjects and share profound insights.",
      8: "You are destined for material and spiritual mastery. Your natural business acumen and power make you excellent at creating abundance. You help others understand the balance of material and spiritual success. Your professional path involves large-scale achievements and powerful influence. Your destiny requires developing mastery over both material resources and personal power. You're here to learn the responsible use of power and the creation of lasting value. The universe guides you toward opportunities where your executive abilities can create widespread prosperity. Pay attention to situations that allow you to demonstrate powerful leadership. Your destiny involves deep intellectual and spiritual exploration. You seek truth, wisdom, and higher understanding, often through academia, research, or spiritual practice. You are meant to develop inner strength and knowledge. Your challenge is to stay connected to the world and not retreat into isolation. You are destined for material success, leadership, and power. Your path involves financial mastery, business acumen, and large-scale achievements. You have a strong sense of justice and ambition. Your challenge is to balance material and spiritual pursuits, avoiding greed or manipulation.",
      9: "Your destiny is to serve humanity with compassion and wisdom. Your universal understanding and artistic abilities make you an inspiring teacher. You help others see their connection to the greater whole. Professionally, you're meant to work in ways that benefit humanity as a whole. Your destiny requires developing universal love and understanding. You're here to learn completion, letting go, and serving the greater good. The universe guides you toward opportunities where your humanitarian ideals can create lasting positive change. Watch for chances to serve others while maintaining healthy boundaries. Your destiny is to serve humanity and bring transformation. You are drawn to humanitarian work, philanthropy, or artistic expression that uplifts society. You have wisdom and a deep sense of compassion. Your challenge is to let go of the past and embrace the flow of life.",
      11: "As a master number, your destiny involves spiritual leadership and inspiration. You have the potential to be a powerful healer and teacher, helping others awaken to their spiritual nature. Your professional path often involves inspiring others through spiritual or creative work. Your destiny requires developing high spiritual awareness while maintaining practical grounding. You're here to learn how to channel spiritual insights into practical benefits for others. The universe guides you toward opportunities where your spiritual awareness can elevate others' consciousness. Pay attention to situations where you can bridge the material and spiritual realms. As a master number, your destiny involves spiritual enlightenment, inspiration, and guiding others. You have heightened intuition and insight, often feeling a deep calling toward service, creativity, or healing. Your challenge is to stay grounded and not become overwhelmed by emotions or expectations.",
      22: "As a master builder number, your destiny involves creating large-scale improvements in the world. You have the potential to manifest significant projects that benefit humanity. Your professional path involves transforming grand visions into practical reality. Your destiny requires developing the ability to work with both detail and vision simultaneously. You're here to learn how to manifest dreams into reality on a large scale. The universe guides you toward opportunities where your practical visionary abilities can create lasting structures for human advancement. Watch for chances to implement large-scale positive changes. Your destiny is to create something monumental and impactful. You are a visionary, capable of manifesting large-scale projects that benefit many. You possess both practicality and big-picture thinking. Your challenge is to avoid getting lost in details or becoming too rigid.",
      33: "Your destiny is to uplift and heal through unconditional love and service. You are a master teacher and healer, you are here to inspire and uplift humanity through love, compassion, and wisdom. You possess great emotional depth and have a profound influence on others. Your challenge is to balance your responsibilities with self-care, ensuring that your devotion to others does not lead to neglecting your own well-being.",
      44: "Your destiny is to structure and manifest significant achievements with discipline and perseverance. You have an unmatched ability to turn dreams into reality but its extremly karmic too at the same time. Your challenge is to avoid becoming too rigid or overly focused on material success and ego. As a semi-master of number, your destiny involves in a karmic energy which makes life a ruber band effect, make sure to do good by others. A master architect of success, you are meant to bring lasting change through discipline, perseverance, and strategic planning. Your ability to create structures and systems benefits both individuals and society. Your challenge is to avoid workaholism, maintain emotional balance, and ensure that your ambitions align with your core values.",
      28: "Your destiny is to be both a leader and a diplomat. You have the drive to succeed, coupled with the ability to work well with others whom highly respects you. You excel in roles requiring balance between authority and cooperation. Your challenge is to trust your intuition and avoid self-doubt, as you are capable of great achievements when you believe in yourself. and lastly you can attract wealth like a magnet. A leader with a balance of ambition and diplomacy, you excel in business and social settings, bringing people together with your charismatic and persuasive nature. You possess strong instincts and can navigate complex situations with ease. Your challenge is to trust your intuition, remain adaptable, and manage authority responsibly."
    };
    return meanings[number] || "A unique destiny number guiding you toward your life's purpose";
  },

  heartDesire: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your heart yearns for independence and leadership opportunities. Deep within, you have a burning desire to create and pioneer new paths, seeking recognition for your unique contributions and innovative ideas. You feel most fulfilled when you can take charge and initiate new projects. In love, you seek a partner who respects your independence while supporting your ambitions. You're motivated by challenges that allow you to prove your capabilities and stand out from the crowd. Your soul's satisfaction comes from achieving personal goals and being recognized as a thought leader or innovator in your field. You may sometimes struggle with accepting help or appearing vulnerable, but your greatest growth comes from learning to balance independence with interdependence.",
      2: "Your heart seeks harmony and meaningful partnerships. You deeply desire peace and cooperation in all your relationships, finding fulfillment in creating balance and understanding between people. Your soul yearns for deep, meaningful connections and the ability to bring people together. In love, you seek a partner who values emotional depth and mutual understanding. You're motivated by opportunities to create peace and foster cooperation between others. Your greatest joy comes from witnessing harmony emerge from conflict and seeing people come together in understanding. While you may sometimes avoid necessary confrontation to maintain peace, your growth comes from learning to address conflicts constructively while maintaining harmony.",
      3: "Your heart yearns for creative expression and joyful connections. You have a deep desire to share your artistic gifts and bring happiness to others through your natural charm and creativity. Your soul seeks opportunities for self-expression and the freedom to explore various forms of creativity. In love, you desire a partner who appreciates your artistic nature and shares your joy for life. You're motivated by chances to perform, create, or communicate in ways that uplift others. Your greatest satisfaction comes from seeing others inspired or moved by your creative expressions. While you may sometimes scatter your energy across too many creative pursuits, your growth comes from learning to focus your creative power effectively.",
      4: "Your heart desires stability and security. You find fulfillment in creating order and structure, both in your personal life and professional endeavors.  You yearn for a sense of reliability and permanence in your relationships and career. You are motivated by opportunities to build something lasting and contribute to a sense of security for yourself and those around you. While a desire for structure can sometimes lead to rigidity, your growth comes from learning to adapt to unexpected changes and maintain flexibility.",
      5: "Your heart yearns for freedom and adventure.  You crave new experiences and the thrill of exploration, both in your personal life and professional pursuits.  You seek partners who share your adventurous spirit and appreciate your need for variety and independence. You're motivated by challenges that push your boundaries and allow you to learn and grow.  Your soul finds satisfaction in constant movement and the excitement of the unknown. While your love of freedom can sometimes lead to restlessness, your growth comes from finding a balance between exploration and commitment.",
      6: "Your heart seeks harmony and nurturing relationships. You find fulfillment in creating a sense of belonging and supporting those you care about. You value family and commitment above all else. You're motivated by opportunities to express your compassion and create a loving environment. Your soul yearns to serve others and create beautiful, meaningful connections. While your nurturing nature can sometimes lead you to overextend yourself, your growth comes from learning to prioritize your own needs while caring for others.",
      7: "Your heart yearns for knowledge and understanding. You are driven by a deep desire to explore the mysteries of life and share your wisdom with others. You seek intellectual stimulation and spiritual growth. You're motivated by opportunities to learn, research, and unravel complex problems. Your soul finds satisfaction in the pursuit of truth and the exploration of profound ideas. While your thirst for knowledge can sometimes lead to isolation, your growth comes from balancing your intellectual pursuits with meaningful human connections.",
      8: "Your heart seeks material success and spiritual fulfillment. You strive for a balance between the material world and the spiritual realm.  You seek to create abundance and leave a lasting legacy. You're motivated by challenges that push you to achieve great things while remaining grounded in your values.  Your soul yearns for a life of purpose and significance, where you can use your talents to benefit others. While ambition can sometimes lead to imbalance, your growth comes from maintaining a healthy connection between material wealth and spiritual well-being.",
      9: "Your heart yearns to serve humanity.  You feel a strong sense of responsibility towards others and a deep desire to contribute to the greater good. You seek partners who share your humanitarian spirit and commitment to social justice.  You're motivated by opportunities to make a positive difference in the world and uplift those in need. Your soul finds satisfaction in working towards a more just and compassionate world. While your compassion can sometimes lead to self-sacrifice, your growth comes from learning to set healthy boundaries and prioritize your own well-being.",
      11: "Your heart yearns for spiritual enlightenment and inspiration.  You seek to connect with your higher self and share your wisdom with others. You value authenticity and inner peace above all else.  You're motivated by opportunities to inspire others and help them awaken to their full potential.  Your soul's purpose is to be a source of light and guidance for those around you. While your spiritual focus can sometimes lead to impracticality, your growth comes from finding a balance between your inner world and the external reality.",
      22: "Your heart yearns to build a lasting legacy. You have a grand vision for the future and a strong desire to create something of significant value for the world.  You seek partners who share your ambition and understand your long-term goals. You're motivated by opportunities to make a substantial and lasting contribution to society. Your soul finds satisfaction in creating something beautiful and enduring that benefits many people. While such ambition can sometimes lead to overwhelm, your growth comes from developing strong organizational skills and creating detailed plans to manifest your vision.",
      33: "Your heart longs to bring healing, love, and guidance to others. You find fulfillment in service and emotional connection. Your challenge is to maintain balance and not take on too much responsibility. ",
      44: "You heart desires discipline, mastery, and great achievements. You long to leave a powerful legacy through structure and perseverance. Your challenge is to avoid rigidity and embrace adaptability. ",
      28: "Your heart seeks both leadership and harmony. You crave success but also value collaboration and relationships. Your challenge is to trust your own instincts and maintain a balance between ambition and cooperation. "
    };
    return meanings[number] || "Your heart's deep desires guide you toward meaningful experiences";
  },

  expression: (number: number) => {
    const meanings: Record<number, string> = {
      1: "You naturally express yourself through leadership and innovation. Your communication style is direct and original, inspiring others with your confident and creative approach to life. In daily interactions, you naturally take charge and guide conversations toward productive outcomes. Your way of expressing yourself commands attention and respect, making you a natural leader in group situations. In professional settings, you excel at presenting new ideas and initiating projects. You have a gift for expressing complex concepts in clear, actionable ways. While you may sometimes come across as too forceful, your authentic expression inspires others to take action and embrace change. Your growth in self-expression comes through learning to balance assertiveness with diplomacy.",
      2: "You express yourself through diplomacy and sensitivity. Your gentle and cooperative nature shines through in your interactions, helping create harmony and understanding. In daily life, you naturally pick up on subtle emotional undercurrents and express yourself in ways that build bridges between people. Your communication style is characterized by patience, tact, and the ability to find common ground. In professional settings, you excel at mediating conflicts and facilitating group discussions. You have a special gift for expressing empathy and understanding in ways that make others feel heard and valued. While you may sometimes hesitate to express controversial views, your authentic expression creates spaces where others feel safe to share their truth. Your growth in self-expression comes through learning to voice your own needs while maintaining your diplomatic nature.",
      3: "Your natural expression is creative and optimistic. You communicate with enthusiasm and artistic flair, bringing joy and inspiration to others through your words and actions. In daily interactions, you naturally inject humor and creativity into conversations, lifting the spirits of those around you. Your communication style is characterized by vivid imagery, storytelling, and the ability to make complex ideas accessible and entertaining. In professional settings, you excel at presentations that combine information with entertainment. You have a special gift for expressing ideas in ways that capture imagination and inspire action. While you may sometimes get carried away with performance, your authentic expression brings light and joy to serious situations. Your growth in self-expression comes through learning to balance entertainment with substance.",
      4: "You express yourself through practical action and reliability. Your communication style is grounded, direct, and focused on results.  You value clarity and efficiency in your interactions. You're known for your dependability and attention to detail.  In professional settings, you excel at organizing information and creating systems that are both functional and efficient. You have a gift for expressing complex information in a simple, understandable way. While you may sometimes come across as rigid or inflexible, your authentic expression brings order and stability to chaotic situations. Your growth in self-expression comes through learning to embrace spontaneity and adapt to unexpected changes.",
      5: "You express yourself through adaptability and versatility. Your communication style is characterized by flexibility and a willingness to embrace change. You're known for your quick wit and ability to connect with people from diverse backgrounds. In professional settings, you excel at navigating complex situations and finding creative solutions to problems. You have a gift for expressing yourself in a way that is both engaging and informative. While your adaptability can sometimes lead to inconsistency, your authentic expression brings dynamism and excitement to any situation. Your growth in self-expression comes through developing a strong sense of personal identity while maintaining your ability to adapt.",
      6: "You express yourself through nurturing and harmony. Your communication style is characterized by empathy, compassion, and a desire to create a sense of belonging. You're known for your ability to make others feel comfortable and supported. In professional settings, you excel at creating collaborative environments and resolving conflicts. You have a gift for expressing yourself in a way that is both kind and effective. While your desire for harmony can sometimes lead to avoidance of conflict, your authentic expression creates spaces where others feel safe and understood. Your growth in self-expression comes through learning to assert your own needs while maintaining your nurturing nature.",
      7: "You express yourself through intellectual curiosity and deep thought. Your communication style is characterized by a focus on detail, analysis, and a desire to explore complex issues. You're known for your intellectual depth and spiritual insight. In professional settings, you excel at research, analysis, and problem-solving. You have a gift for expressing complex ideas in a way that is both precise and engaging. While your focus on intellectual pursuits can sometimes lead to isolation, your authentic expression brings clarity and insight to challenging situations. Your growth in self-expression comes through learning to communicate your ideas effectively to a wider audience.",
      8: "You express yourself through authority and power. Your communication style is confident, direct, and focused on achieving results. You're known for your leadership skills and ability to inspire others. In professional settings, you excel at strategic planning, negotiation, and decision-making. You have a gift for expressing your vision in a way that is both compelling and motivating. While your power can sometimes lead to dominance, your authentic expression inspires others to achieve their full potential. Your growth in self-expression comes through learning to use your power responsibly and ethically.",
      9: "You express yourself through compassion and universal understanding. Your communication style is characterized by empathy, inclusivity, and a desire to connect with others on a deep level. You're known for your humanitarian spirit and artistic sensitivity. In professional settings, you excel at creating positive change and working collaboratively with people from diverse backgrounds. You have a gift for expressing yourself in a way that is both inspiring and meaningful. While your compassion can sometimes lead to self-sacrifice, your authentic expression brings hope and inspiration to the world. Your growth in self-expression comes through learning to maintain healthy boundaries while serving others.",
      11: "You express yourself through spiritual insight and inspiration. Your communication style is characterized by intuition, creativity, and a desire to connect with others on a spiritual level. You're known for your visionary thinking and ability to see the bigger picture. In professional settings, you excel at spiritual guidance, teaching, and creative expression. You have a gift for expressing complex spiritual concepts in a simple, understandable way. While your spiritual focus can sometimes lead to idealism, your authentic expression brings light and hope to those seeking guidance. Your growth in self-expression comes through finding a balance between spiritual insight and practical action.",
      22: "You express yourself through practical vision and large-scale planning.  Your communication style is characterized by strategic thinking, foresight, and a dedication to creating lasting impact. You're known for your ability to develop and execute ambitious projects. In professional settings, you excel at long-term planning, resource management, and leadership. You have a gift for expressing your vision in a way that inspires confidence and motivates action. While your focus on large-scale projects can sometimes lead to a lack of attention to detail, your authentic expression creates lasting positive change in the world. Your growth in self-expression comes through learning to delegate effectively and trust others with the execution of your plans.",
      33: "You express yourself through love, teaching, and guidance. You uplift and inspire those around you. Your challenge is to maintain personal boundaries while helping others, You come across as warm, compassionate, and inspiring. People see you as a teacher or guide. Your challenge is to avoid taking on too much responsibility for others. ",
      44: "You express yourself through immense determination, discipline, and practicality. You have the ability to bring large-scale ideas into reality through hard work and persistence. Your strategic mindset allows you to build lasting success, but your challenge is to balance your ambition with emotional well-being and personal fulfillment.",
      28: "You express yourself through leadership, ambition, and diplomacy. You naturally assume authority while maintaining the ability to work well with others. Your confidence and charisma make you influential in professional and social circles. Your challenge is to trust your instincts, remain open to collaboration, and adapt to changing circumstances. "
    };
    return meanings[number] || "Your unique expression reveals your authentic self to the world";
  },

  personality: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your outer personality radiates confidence and independence. Others see you as a natural leader with original ideas and the courage to forge new paths. You appear innovative and self-reliant.  In relationships, this can be perceived as aloofness unless you make an effort to connect on a deeper level.  Professionally, this translates to strong leadership potential, but you need to balance your independence with teamwork and collaboration. Your challenge is to avoid appearing arrogant or insensitive. Your greatest opportunities arise when you combine your leadership abilities with empathy and understanding.",
      2: "You come across as diplomatic and understanding. Others perceive your gentle strength and ability to create harmony. You appear cooperative and sensitive to others' needs. In relationships, your ability to create harmony is highly valuable, but you should avoid becoming a people-pleaser. Professionally, you excel in roles that involve negotiation, mediation, and collaboration. Your challenge is to assert your needs while maintaining your diplomatic approach. Your greatest opportunities come when you combine your diplomacy with a healthy sense of self-worth.",
      3: "Your personality sparkles with creativity and sociability. Others see your natural charm and artistic abilities. You appear optimistic and capable of bringing joy to any situation. In relationships, your cheerful and expressive nature is highly appealing, though you may need to curb your exuberance at times. Professionally, you thrive in creative environments and roles that involve communication and interaction. Your challenge is to maintain discipline and focus, preventing your energy from becoming scattered. Your greatest opportunities come when you combine your creative talent with a strong work ethic.",
      4: "You present yourself as reliable and organized. Others recognize your practical wisdom and steady approach. You appear trustworthy and capable of handling responsibilities. In relationships, your dependability is a valuable asset, though you may need to loosen up occasionally.  Professionally, you excel in roles requiring organization, structure, and attention to detail. Your challenge is to avoid becoming rigid and inflexible. Your greatest opportunities come when you combine your organizational skills with adaptability and innovation.",
      5: "Your personality exudes adaptability and enthusiasm. Others see your adventurous spirit and love of freedom. You appear dynamic and ready for new experiences. In relationships, your adventurous nature is highly attractive, but you need partners who understand your need for variety and change.  Professionally, you thrive in dynamic environments and roles that allow for growth and exploration. Your challenge is to find balance and stability while maintaining your love of adventure. Your greatest opportunities come when you combine your adaptability with a commitment to long-term goals.",
      6: "You come across as nurturing and responsible. Others recognize your caring nature and ability to create harmony. You appear capable of handling family and community responsibilities. In relationships, your nurturing nature is deeply appealing, but you should avoid overextending yourself. Professionally, you excel in roles involving caregiving, teaching, or creating harmonious environments. Your challenge is to establish healthy boundaries while caring for others.  Your greatest opportunities come when you combine your nurturing abilities with a strong sense of self-preservation.",
      7: "Your personality reflects wisdom and mystery. Others see your analytical mind and spiritual depth. You appear thoughtful and capable of deep understanding. In relationships, your intellectual depth and spiritual awareness are highly attractive, though you may need to connect more directly at times. Professionally, you excel in roles involving research, analysis, or exploration of complex issues. Your challenge is to combine your intellectual pursuits with effective communication. Your greatest opportunities come when you share your wisdom and insights with others.",
      8: "You present yourself as confident and capable. Others recognize your executive ability and potential for success. You appear able to achieve significant goals. In relationships, your confidence and ambition are attractive, but you need to avoid appearing domineering. Professionally, you excel in leadership roles requiring executive ability and strategic planning. Your challenge is to combine your ambition with ethical responsibility and compassion. Your greatest opportunities come when you use your power to benefit others as well as yourself.",
      9: "Your personality radiates universal understanding. Others see your humanitarian nature and artistic sensitivity. You appear wise and compassionate. In relationships, your universal love and compassion are highly appealing, though you might need to assert your own needs at times. Professionally, you excel in humanitarian work, teaching, or creative fields that benefit society.  Your challenge is to balance your service to others with self-care.  Your greatest opportunities come when you combine your compassion with clear boundaries and a commitment to your own well-being.",
      11: "You come across as inspired and enlightened, charismatic. Others sense your spiritual awareness and intuitive abilities. You appear capable of providing spiritual guidance. In relationships, your spiritual depth is highly attractive, but you need partners who understand your intuitive nature. Professionally, you excel in roles involving spiritual counseling, teaching, or creative expression. Your challenge is to ground your spiritual insights in practical application.  Your greatest opportunities come when you combine your spiritual awareness with a practical approach to life.",
      22: "Your personality reflects practical mastery. Others recognize your ability to achieve great things. You appear capable of creating significant positive change. In relationships, your vision and ability to create lasting structures are highly attractive. Professionally, you excel in roles that allow you to manifest your grand vision on a large scale. Your challenge is to delegate effectively and trust others with the execution of your plans. Your greatest opportunities come when you combine your ability to envision the future with the practical steps needed to make it a reality.",
      33: "You appear warm, compassionate, and charismatic. Others see you as a guiding light and naturally turn to you for support, wisdom, and comfort. You exude kindness and inspire those around you with your nurturing presence. Your challenge is to ensure that you do not absorb the emotional burdens of others, maintaining your own sense of balance. ",
      44: "You appear strong, disciplined, and goal-oriented. Others see you as a builder of success, someone who is reliable and capable of achieving great things. You have a no-nonsense attitude toward life and command respect. Your challenge is to balance your intense drive with personal relationships and emotional expression. ",
      28: "You appear charismatic, confident, and diplomatic. Others see you as a natural leader with a strong presence. You have a unique ability to bring people together, mediate conflicts, and lead with authority. Your challenge is to maintain balance between ambition and emotional needs, ensuring that you do not become too focused on control or success at the expense of personal fulfillment. "
    };
    return meanings[number] || "Your unique personality makes a distinct impression on others";
  },

  attribute: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your core attribute is leadership and originality. You have natural abilities in pioneering new paths and inspiring others through your innovative thinking and independent action. In relationships, your independence is a strength, but you should focus on building deeper connections. Professionally, you are a natural leader and innovator. Your challenge is to balance your independence with collaboration and teamwork. Your greatest opportunities come when you combine your leadership skills with an understanding of others' perspectives.",
      2: "Your core attribute is diplomacy and cooperation. You excel at creating harmony and understanding between people, with natural abilities in partnership and mediation. In relationships, your diplomacy is a valuable asset, but you should also be assertive when necessary. Professionally, you thrive in collaborative environments and roles involving negotiation and mediation. Your challenge is to assert your own needs while maintaining your diplomatic approach. Your greatest opportunities come when you combine your diplomacy with strength and assertiveness.",
      3: "Your core attribute is creativity and expression. You have natural abilities in artistic endeavors and communication, bringing joy and inspiration to others. In relationships, your creativity and expressiveness are highly appealing, but you should also focus on deeper connection. Professionally, you excel in creative fields, public speaking, and roles that allow you to express yourself. Your challenge is to maintain focus and discipline while remaining creatively expressive. Your greatest opportunities come when you combine your creativity with a strong work ethic.",
      4: "Your core attribute is organization and reliability. You excel at creating stable foundations and managing practical matters with natural abilities in systematic thinking. In relationships, your dependability is a valuable asset, but you should also maintain flexibility. Professionally, you excel in roles that require organization, structure, and attention to detail. Your challenge is to avoid becoming rigid and inflexible. Your greatest opportunities come when you combine your organizational skills with a willingness to adapt to changing circumstances.",
      5: "Your core attribute is adaptability and freedom. You have natural abilities in embracing change and exploring new possibilities, bringing excitement and variety to life. In relationships, your adaptability is a great strength, but you need partners who understand your need for freedom. Professionally, you thrive in dynamic environments and roles that allow for growth and exploration. Your challenge is to find stability while maintaining your adventurous spirit. Your greatest opportunities come when you combine your adaptability with a commitment to long-term goals.",
      6: "Your core attribute is nurturing and responsibility. You excel at creating harmony and taking care of others, with natural abilities in counseling and guidance. In relationships, your nurturing nature is deeply appealing, but you should avoid overextending yourself. Professionally, you excel in roles involving caregiving, teaching, or creating harmonious environments. Your challenge is to maintain healthy boundaries while nurturing others. Your greatest opportunities come when you combine your nurturing abilities with a strong sense of self-preservation.",
      7: "Your core attribute is wisdom and analysis. You have natural abilities in understanding complex matters and seeking deeper truth, bringing insight to situations. In relationships, your intellectual depth and spiritual awareness are highly attractive, but you need partners who appreciate your contemplative nature.  Professionally, you excel in roles involving research, analysis, or exploration of complex issues. Your challenge is to balance your intellectual pursuits with effective communication. Your greatest opportunities come when you effectively share your insights with others.",
      8: "Your core attribute is achievement and authority. You excel at managing resources and creating success, with natural abilities in leadership and business. In relationships, your confidence and ambition are attractive, but you need to avoid being domineering. Professionally, you excel in leadership roles requiring executive ability and strategic planning. Your challenge is to balance ambition with humility and ethical responsibility. Your greatest opportunities come when you use your power to benefit others as well as yourself.",
      9: "Your core attribute is compassion and universal understanding. You have natural abilities in helping others and seeing the bigger picture of life. In relationships, your compassion and understanding are highly appealing, but you should also assert your own needs. Professionally, you excel in humanitarian work, teaching, or creative fields that benefit society. Your challenge is to balance your service to others with self-care. Your greatest opportunities come when you combine your compassion with a clear sense of purpose and healthy boundaries.",
      11: "Your core attribute is spiritual insight and inspiration. You excel at understanding and sharing higher wisdom, with natural abilities in intuitive guidance. In relationships, your spiritual depth and intuition are highly attractive, but you need partners who understand your need for introspection. Professionally, you excel in roles involving spiritual counseling, teaching, or creative expression.  Your challenge is to ground your spiritual insights in practical application.  Your greatest opportunities come when you combine your spiritual awareness with a practical approach to life.",
      22: "Your core attribute is practical vision and manifestation. You have natural abilities in creating large-scale improvements and bringing ideas into reality. In relationships, your ability to create lasting structures is highly attractive. Professionally, you excel in roles that allow you to manifest your grand vision on a large scale. Your challenge is to delegate effectively and trust others with the execution of your plans. Your greatest opportunities come when you combine your ability to envision the future with the practical steps needed to make it a reality.",
      33: "A compassionate and spiritually-driven guide, you are meant to teach, heal, and uplift others. Your wisdom and kindness make you an inspiration to those who seek guidance. Your challenge is to balance your high ideals with practical realities, ensuring that your efforts remain sustainable and do not drain your energy. ",

      44: "A visionary with immense discipline, you are here to create structures that benefit many. You have a strong sense of purpose and the ability to manifest significant achievements. Your challenge is to integrate emotional intelligence into your leadership, ensuring that your determination does not come at the cost of personal connections or well-being. ",

      28: "A dynamic leader with diplomatic skills, you bridge gaps between different perspectives and unite people toward a common goal. Your ability to adapt, negotiate, and inspire makes you a powerful force in leadership. Your challenge is to remain adaptable, trust your judgment, and ensure that your ambition does not overshadow your emotional well-being. "


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
        recommendations.strengths.push("Deep analytical abilities (Intellect)");
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
        recommendations.challenges.push("Maysacrifice personal needs for others");
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
      case 33:
        recommendations.strengths.push("Natural ability to guide and inspire others");
        recommendations.challenges.push("Emotional exhaustion from absorbing others’ struggles");
        recommendations.growthAreas.push("Channeling emotions into creative or therapeutic outlets");
        recommendations.practices.push("Practice mindfulness and emotional regulation techniques");
        break;
      case 44:
        recommendations.strengths.push("Set clear goals with structured timelines to maximize productivity");
        recommendations.challenges.push("Becoming too focused on control and Struggles with vulnerability");
        recommendations.growthAreas.push("Developing emotional intelligence and openness");
        recommendations.practices.push("Practice mindfulness and relaxation techniques to maintain balance");
        break;
      case 28:
        recommendations.strengths.push("Strong leadership and communication skills");
        recommendations.challenges.push("Managing authority without becoming overly controlling");
        recommendations.growthAreas.push("Learning when to take charge and when to collaborate");
        recommendations.practices.push("Develop strong negotiation skills to enhance leadership");
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
                            numbers.expression === 22 ? "spiritual expression" :
                              numbers.expression === 33 ? "setting personal boundaries" :    
                                numbers.expression === 44 ? "not to become too rigid or focused on control" :
                                  numbers.expression === 28 ? "not to overanalyze and second-guess decisions" :
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
                            numbers.expression === 33 ? "guiding and inspiring others" :    
                              numbers.expression === 44 ? "Unwavering determination and perseverance" :
                                numbers.expression === 28 ? "Adaptability and strategic thinking" :
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
                            numbers.expression === 33 ? "Practice mindfulness and emotional regulation techniques" :
                              numbers.expression === 44 ? "Set clear goals with structured timelines to maximize productivity" :
                                numbers.expression === 28 ? "Strengthening decision-making and trust in intuition" :
                            "practical manifestation" // 22
      }. Use these gifts in your personal development journey.`
    };
  },

  birthDateNum: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Born on the 1st, you embody natural leadership qualities and pioneering spirit. Your birthday grants you exceptional independence, originality, and determination. You're naturally drawn to innovation and have the courage to forge new paths. This number enhances your ability to overcome obstacles through willpower and creative thinking. You excel in roles that require initiative and self-reliance. In relationships, you value partners who respect your independence and support your vision.  Professionally, you thrive in leadership roles, entrepreneurial ventures, and innovative fields. Your challenge is to balance self-reliance with collaboration and to listen to others' perspectives. Your greatest opportunities arise when you channel your leadership abilities into meaningful and collaborative endeavors.",
      2: "Your birth on a 2nd day imbues you with remarkable diplomatic abilities and intuitive sensitivity. You possess natural talents in cooperation and maintaining harmony in relationships. This birthday enhances your ability to see multiple perspectives and find peaceful resolutions to conflicts. You excel in partnerships and situations requiring careful negotiation. In relationships, you excel at creating deep, meaningful connections and understanding unspoken emotions. Professionally, you thrive in roles involving diplomacy, mediation, and collaboration. Your challenge is to maintain healthy boundaries while serving others, and to express your own needs assertively. Your greatest opportunities arise when you balance your natural diplomacy with the strength of your own convictions.",
      3: "Born on the 3rd, you possess inherent creative talents and exceptional communication abilities. Your birthday grants you natural charm, artistic expression, and optimistic energy. This number amplifies your capacity to inspire others through various forms of creative expression. You have a gift for bringing joy and enthusiasm to any situation. In relationships, you bring creativity, joy, and lightheartedness. Professionally, you thrive in creative fields, public speaking, and entertainment. Your challenge is to focus your abundant creative energy and follow through on projects. Your greatest opportunities come when you channel your creativity into structured, meaningful endeavors that benefit others.",
      4: "Your birth on a 4th day gives you strong organizational abilities and practical wisdom. You possess natural talents in building stable foundations and managing complex systems. This birthday enhances your capacity for disciplined work and methodical problem-solving. You excel in situations requiring reliability and attention to detail. In relationships, you value stability, commitment, and security. Professionally, you excel in roles that require organization, structure, and attention to detail. Your challenge is to remain flexible and open to change while maintaining your stable nature. Your greatest opportunities arise when you combine your practical skills with innovative thinking.",
      5: "Born on the 5th, you embody adaptability and progressive thinking. Your birthday grants you natural versatility and an adventurous spirit. This number amplifies your ability to embrace change and inspire others to explore new possibilities. You excel in dynamic environments that require quick thinking and flexibility. In relationships, you bring excitement, variety, and a love of new experiences. Professionally, you thrive in dynamic environments that require adaptability and quick thinking. Your challenge is to find stability within change and commit to long-term goals. Your greatest opportunities come when you channel your adaptable nature into progressive, sustainable ventures.",
      6: "Your birth on a 6th day bestows strong nurturing abilities and a sense of responsibility. You possess natural talents in creating harmony and supporting others. This birthday enhances your capacity for understanding emotional needs and creating beautiful environments. You excel in roles involving care, guidance, and artistic expression. In relationships, you're deeply committed and nurturing, often serving as the family anchor. Professionally, you thrive in helping professions, teaching, or creative fields focused on beauty and harmony. Your challenge is to avoid taking on too much responsibility for others' well-being. Your greatest opportunities arise when you balance your nurturing nature with self-care.",
      7: "Born on the 7th, you possess deep analytical abilities and spiritual awareness. Your birthday grants you natural investigative talents and philosophical insight. This number amplifies your capacity for research, analysis, and understanding life's mysteries. You excel in pursuits requiring deep thought and spiritual understanding. In relationships, you seek deep, meaningful connections with those who understand your need for solitude and contemplation. Professionally, you excel in research, analysis, spiritual studies, or technological fields. Your challenge is to bridge the gap between your inner wisdom and practical application. Your greatest opportunities come when you share your insights while maintaining your sacred space.",
      8: "Your birth on an 8th day indicates strong executive abilities and material wisdom. You possess natural talents in business and achievement. This birthday enhances your capacity for managing resources and creating success. You excel in situations requiring leadership and financial acumen. In relationships, you seek partners who understand your ambition and share your values. Professionally, you excel in executive leadership, financial management, or large-scale project direction. Your challenge is to maintain spiritual and emotional balance while pursuing material success. Your greatest opportunities arise when you use your power to benefit others while achieving personal success.",
      9: "Born on the 9th, you embody humanitarian ideals and universal understanding. Your birthday grants you natural compassion and artistic sensitivity. This number amplifies your capacity for serving others and seeing the bigger picture. You excel in roles that allow you to make a positive impact on humanity. In relationships, you bring depth, wisdom, and universal love. Professionally, you thrive in humanitarian work, teaching, or creative endeavors that benefit humanity. Your challenge is to complete personal cycles while maintaining boundaries in service to others. Your greatest opportunities come when you embrace your role as a wisdom keeper and guide for others.",
      11: "Your birth on the 11th gives you master number qualities of inspiration and spiritual insight. You possess natural intuitive abilities and visionary thinking. This birthday enhances your capacity for spiritual leadership and inspiring others. You excel in roles that allow you to share higher wisdom. In relationships, you bring deep understanding and inspiration. Professionally, you excel in spiritual counseling, teaching, or innovative creative fields. Your challenge is to ground your spiritual insights into practical application. Your greatest opportunities arise when you embrace your role as a spiritual guide while maintaining everyday responsibilities.",
      22: "Born on the 22nd, you embody the master builder energy. You possess natural talents in manifestation and practical achievement. This birthday enhances your capacity for creating large-scale improvements and bringing ideas into reality. You excel in projects that benefit many people. In relationships, you seek partners who understand your grand vision and support your ambitious goals. Professionally, you excel in large-scale projects that benefit many people. Your challenge is to manifest your expansive visions while attending to practical details. Your greatest opportunities come when you fully embrace your ability to transform dreams into reality on a grand scale.",
      33: "As a master number, You are meant to uplift and guide others with love, you embody selfless love, deep compassion, and spiritual enlightenment. You have a rare gift for uplifting others through your wisdom, creativity, and nurturing energy. People are naturally drawn to your presence because of your ability to inspire and heal. In relationships, you give unconditional love and tend to sacrifice your own needs for the happiness of others. Your career path often involves teaching, spiritual counseling, healing professions, or any role that allows you to serve humanity on a deep level. Your challenge is to set healthy boundaries and not lose yourself in the service of others. You tend to take on too much responsibility, which can lead to emotional and physical exhaustion. Your greatest opportunities come when you balance your selfless nature with self-care and embrace your role as a guiding light for others. You struggle with perfectionism, and your high expectations of yourself and others can lead to disappointment. Learning to let go and trust the process will help you fulfill your higher purpose.",
      44: "You are destined to build lasting legacies. You possess extraordinary potential for discipline, stability, and grounded wisdom. Unlike 22, which builds large visions, 44 is more about execution, structure, and real-world mastery. You are practical, methodical, and capable of creating solid, tangible success through persistence and patience. But since you possess karma it can be completly oposite too. You have a strong sense of responsibility and thrive in positions that require leadership, problem-solving, and long-term planning. In relationships, you seek loyalty and security, often taking on the role of protector or provider. However, your serious nature can sometimes make you emotionally distant or rigid. Your career path is often tied to entrepreneurship, engineering, finance, real estate, or any field that requires long-term vision and commitment. Your challenge is to avoid getting too caught up in work and material success, neglecting personal fulfillment and relationships. You tend to carry the burdens of others, often feeling responsible for things beyond your control. Your greatest opportunities arise when you learn to balance work with emotional well-being, ensuring that your achievements also bring you inner peace. You have a tendency to be skeptical of anything spiritual or abstract, which can limit your perspective.",
      28: "You are meant to be a leader with ambition. You are a natural leader with a strong presence and the ability to command authority. You possess a rare blend of independence, ambition, and charisma, making you highly influential. People often see you as confident, resourceful, and capable of handling any situation. Your energy is dynamic, and you thrive in roles that allow you to take charge, make decisions, and lead others toward success. In relationships, you are passionate and loyal, but you have a strong need for control, which can create power struggles. You attract partners who admire your strength but may struggle with your dominant nature. Your career path often involves business, law, politics, leadership roles, or any field where you can strategically build success and wealth. Your challenge is to balance power with humility and not let ambition turn into arrogance. You can sometimes be too focused on material success, neglecting the emotional and spiritual aspects of life. Your greatest opportunities come when you use your influence for the greater good rather than purely personal gain. You can be impatient, and when things don’t go as planned, you may struggle with frustration. Learning to adapt and trust divine timing will help you reach your full potential."
    };
    return meanings[number] || "Your birth date number reveals unique talents and personal characteristics that influence your life journey";
  },

  getBasicInterpretation: (numbers: {
    lifePath: number;
    destiny: number;
    heartDesire: number;
    expression: number;
    personality: number;
    attribute: number;
    birthDateNum: number;
  }) => {
    const personalDev = basicInterpretations.personalDevelopment(numbers);

    return {
      lifePath: basicInterpretations.lifePath(numbers.lifePath),
      destiny: basicInterpretations.destiny(numbers.destiny),
      heartDesire: basicInterpretations.heartDesire(numbers.heartDesire),
      expression: basicInterpretations.expression(numbers.expression),
      personality: basicInterpretations.personality(numbers.personality),
      attribute: basicInterpretations.attribute(numbers.attribute),
      birthDateNum: basicInterpretations.birthDateNum(numbers.birthDateNum),
      overview: `Your Life Path ${numbers.lifePath} reveals your life's purpose and the lessons you're here to learn. Your Destiny number ${numbers.destiny} shows your potential and the goals you're meant to achieve. Your Heart's Desire ${numbers.heartDesire} indicates your inner motivation and what truly makes you happy. Your Expression number ${numbers.expression} reveals how you share yourself with the world, while your Personality number ${numbers.personality} shows how others perceive you. Your Attribute number ${numbers.attribute} highlights your natural talents and core characteristics that help you achieve your goals. Your Birth Date number ${numbers.birthDateNum} reveals specific talents and abilities you brought into this life.`,
      recommendations: personalDev.recommendations,
      developmentSummary: personalDev.summary
    };
  }
};

// Add Chinese Zodiac interpretations
export type ZodiacSign = 'Rat' | 'Ox' | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake' | 'Horse' | 'Sheep' | 'Monkey' | 'Rooster' | 'Dog' | 'Pig';

export const zodiacInterpretations: Record<ZodiacSign, {
  traits: string[],
  characteristics: string,
  compatibility: {
    best: string,
    worst: string,
    description: string
  }
}> = {
  'Rat': {
    traits: ['Frugal', 'ambitious', 'honest', 'charming', 'critical'],
    characteristics: 'Ambitious, candid, competitive and congenial, Rats are natural leaders. They have strong interpersonal skills and can easily connect with others.',
    compatibility: {
      best: 'Dragon, Monkey',
      worst: 'Horse',
      description: 'Rats form meaningful relationships with specific Zodiac signs, especially Dragons and Monkeys who complement their ambitious nature.'
    }
  },
  'Ox': {
    traits: ['Perseverant', 'patient', 'hardworking', 'determined', 'stubborn'],
    characteristics: "The Ox is a pillar of strength in its communities, recognized for their diligence, dependability, and honesty. Their commitment to their goals and responsibilities sets them apart as reliable and trustworthy individuals.",
    compatibility: {
      best: "Rat",
      worst: "Sheep",
      description: "The Ox's compatibility with other Zodiac signs, such as the Rat and Rooster, showcases the harmonious relationships that can form based on complementary traits."
    }
  },
  'Tiger': {
    traits: ['Courageous', 'candid', 'confident', 'adventurous', 'sensitive'],
    characteristics: "Tigers embody the qualities of courage, charisma, and unpredictability. Tigers are known for their boldness and adventurous spirit, often taking on challenges with unwavering determination.",
    compatibility: {
      best: "Pig",
      worst: "Monkey",
      description: "Tigers form strong connections with the Pig, admiring their kindness and good-hearted nature, finding in them a reliable and trustworthy partner."
    }
  },
  'Rabbit': {
    traits: ['Gentle', 'intelligent', 'loving', 'articulate', 'lucky'],
    characteristics: "Rabbits possess kindness, sensitivity, and creativity, making them compassionate and empathetic individuals. They are known for their gentle and nurturing nature.",
    compatibility: {
      best: "Dog", 
      worst: "Rooster",
      description: "Rabbits and Dogs share a harmonious and supportive relationship, marked by a shared sense of loyalty."
    }
  },
  'Dragon': {
    traits: ['Strong', 'independent', 'fortunate', 'ambitious', 'confident'],
    characteristics: "The Dragon is associated with traits of strength, ambition, and vitality, embodying the spirit of power and success. They are known for their leadership qualities and charismatic presence.",
    compatibility: {
      best: "Rooster",
      worst: "Dog",
      description: "Dragons and Roosters form a powerful and dynamic partnership. The bold and charismatic Dragon is captivated by the Rooster's diligence and practicality."
    }
  },
  'Snake': {
    traits: ['Ambitious', 'wise', 'intense', 'determined', 'enigmatic'],
    characteristics: "The Snake is characterized by wisdom, intuition, and sophistication, making it insightful and perceptive. Snakes possess a deep knowledge of the world around them.",
    compatibility: {
      best: "Monkey",
      worst: "Pig",
      description: "Snakes and Monkeys are drawn together by an attraction to each other's intelligence and adaptability."
    }
  },
  'Horse': {
    traits: ['Energetic', 'free', 'popular', 'positive', 'animated'],
    characteristics: "The Horse is characterized by independence, enthusiasm, and energy, embodying a spirited and free-spirited nature. Horses are known for their zest for life and passion for exploration.",
    compatibility: {
      best: "Sheep",
      worst: "Rat",
      description: "Horses and Goats enjoy a naturally harmonious relationship, enriched by emotional depth."
    }
  },
  'Goat': {
    traits: ['Kind', 'patient', 'persuasive', 'gentle', 'calm'],
    characteristics: "The Goat is known for its gentle and kind nature. People born under this sign are often artistic, creative, and compassionate individuals.",
    compatibility: {
      best: "Horse",
      worst: "Ox",
      description: "Goats find their most compatible match in the Horse. This pairing is celebrated for its emotional resonance and shared values."
    }
  },
  'Monkey': {
    traits: ['Intelligent', 'influential', 'curious', 'passionate', 'sharp'],
    characteristics: "The Monkey is often described as witty, intelligent, and playful. They are known for their quick thinking and adaptability, able to navigate various situations with ease.",
    compatibility: {
      best: "Snake",
      worst: "Tiger",
      description: "Monkeys and Snakes are an intellectually matched pair that thrives on mental agility and strategic thinking."
    }
  },
  'Rooster': {
    traits: ['Empathetic', 'creative', 'reliable', 'consistent', 'observant'],
    characteristics: "The Rooster is confident, hardworking, and detail-oriented. They have a strong sense of responsibility and dedication to their goals.",
    compatibility: {
      best: "Dragon",
      worst: "Rabbit",
      description: "Roosters find a most compatible partner in the Dragon. The meticulous Rooster is drawn to the Dragon's boldness and strength."
    }
  },
  'Dog': {
    traits: ['Loyal', 'honest', 'generous', 'playful', 'lovely'],
    characteristics: "Dogs are often seen as loyal, honest, and compassionate. They are known for their protective nature and loyalty to their loved ones.",
    compatibility: {
      best: "Rabbit",
      worst: "Dragon",
      description: "Dogs and Rabbits share a strong connection, underscored by shared values and an understanding of each other's needs."
    }
  },
  'Pig': {
    traits: ['Happy', 'generous', 'logical', 'loving', 'compassionate'],
    characteristics: "The Pig is kind, generous, and easygoing. They are known for their gentle nature and willingness to help others.",
    compatibility: {
      best: "Tiger",
      worst: "Snake", 
      description: "Pigs and Tigers form a relationship that is both nurturing and invigorating. The kind-hearted Pig is attracted to the Tiger's courageous and adventurous spirit."
    }
  }
};

// Chinese Zodiac interpretations based on traditional knowledge 
export const zodiacInterpretations = {
  'Rat': {
    traits: ['Frugal', 'ambitious', 'honest', 'charming', 'critical'],
    characteristics: 'Ambitious, candid, competitive and congenial, Rats are natural leaders. They have strong interpersonal skills and can easily connect with others.',
    compatibility: {
      best: 'Dragon, Monkey', 
      worst: 'Horse',
      description: 'Rats form meaningful relationships with specific Zodiac signs, especially Dragons and Monkeys who complement their ambitious nature.'
    }
  },
  'Ox': {
    traits: ['Perseverant', 'patient', 'hardworking', 'determined', 'stubborn'],
    characteristics: 'Average with Ox, Worst Couple with Tiger, Bento Buddies with Rabbit, Worst Couple with Dragon, Bento Buddies with Snake, Worst Couple with Horse, Worst Couple with Sheep, Perfect Match with Monkey, Perfect Match with Rooster, Bento Buddies with Dog, Good Match with Pig, Perfect Match with Rat.',
    compatibility: {
      best: 'Snake, Rooster',
      worst: 'Sheep', 
      description: 'The Ox has excellent compatibility with the Snake and Rooster, sharing their dedication and reliability.'
    }
  },
  'Tiger': {
    traits: ['Courageous', 'candid', 'confident', 'adventurous', 'sensitive'],
    characteristics: 'Worst Couple With OX, Worst Couple With Tiger, Average With Rabbit, Perfect Match Dragon, Worst Couple With Snake, Perfect Match With Horse, Good Friend With Sheep, Worst Couple With Monkey, Bento Buddies With Rooster, Bento Buddies With Dog, Perfect Match With Rat.',
    compatibility: {
      best: 'Horse, Dog',
      worst: 'Monkey',
      description: 'Tigers find their strongest connections with Horses and Dogs, who match their adventurous spirit.'
    }
  },
  'Rabbit': {
    traits: ['Gentle', 'intelligent', 'loving', 'articulate', 'lucky'],
    characteristics: 'Bento Buddies With OX, Average With Tiger, Average With Rabbit, Average With Dragon, Worst Couple With Snake, Average With Horse, Perfect Match With Sheep, Perfect Match With Monkey, Worst Couple With Rooster, Perfect Match With Dog, Perfect Match With Pig, Perfect Match With Rat.',
    compatibility: {
      best: 'Sheep, Dog',
      worst: 'Rooster',
      description: 'Rabbits harmonize wonderfully with Sheep and Dogs, creating peaceful and supportive relationships.'
    }
  },
  'Dragon': {
    traits: ['Strong', 'independent', 'fortunate', 'ambitious', 'confident'],
    characteristics: 'Worst Couple With OX, Perfect Match With Tiger, Average With Rabbit, Good Friend With Dragon, Perfect Match With Snake, Average With Horse, Worst Couple With Sheep, Bento Buddies With Monkey, Bento Buddies With Rooster, Worst Couple With Dog, Average With Pig, Perfect Match With Rat.',
    compatibility: {
      best: 'Rat, Monkey',
      worst: 'Dog',
      description: 'Dragons find their best matches with Rats and Monkeys, who appreciate their strength and ambition.'
    }
  },
  'Snake': {
    traits: ['Ambitious', 'wise', 'intense', 'determined', 'enigmatic'],
    characteristics: 'Bento Buddies With OX, Worst Couple With Tiger, Worst Couple With Rabbit, Perfect Match With Dragon, Worst Couple With Snake, Good Friend With Horse, Worst Couple With Sheep, Good Friend With Monkey, Perfect Match With Rooster, Average With Dog, Worst Couple With Pig, Good Friend With Rat.',
    compatibility: {
      best: 'Dragon, Rooster',
      worst: 'Pig',
      description: 'Snakes connect deeply with Dragons and Roosters, sharing their wisdom and determination.'
    }
  },
  'Horse': {
    traits: ['Energetic', 'free', 'popular', 'positive', 'animated'],
    characteristics: 'Worst Couple With OX, Perfect Match With Tiger, Average With Rabbit, Average With Dragon, Good Friend With Snake, Worst Couple With Horse, Perfect Match With Sheep, Average With Monkey, Worst Couple With Rooster, Average With Dog, Bento Buddies With Pig, Worst Couple With Rat.',
    compatibility: {
      best: 'Tiger, Sheep',
      worst: 'Rat',
      description: 'Horses find their perfect matches with Tigers and Sheep, who understand their need for freedom.'
    }
  },
  'Sheep': {
    traits: ['Kind', 'patient', 'persuasive', 'gentle', 'calm'],
    characteristics: 'Worst Couple WithOX, Average With Tiger, Perfect Match With Rabbit, Worst Couple With Dragon, Worst Couple With Snake, Perfect Match With Horse, Bento Buddies With Sheep, Bento Buddies With Monkey, Average With Rooster, Worst Couple With Dog, Perfect Match With Pig, Good Match or Enemy With Rat.',
    compatibility: {
      best: 'Rabbit, Horse',
      worst: 'Ox',
      description: 'Sheep form harmonious bonds with Rabbits and Horses, who appreciate their gentle nature.'
    }
  },
  'Monkey': {
    traits: ['Intelligent', 'influential', 'curious', 'passionate', 'sharp'],
    characteristics: 'Perfect Match With OX, Worst Couple With Tiger, Perfect Match With Rabbit, Bento Buddies With Dragon, Good Friend With Snake, Average With Horse, Bento Buddies With Sheep, Good Friend With Monkey, Average With Rooster, Bento Buddies With Dog, Worst Couple With Pig, Perfect Match With Rat.',
    compatibility: {
      best: 'Rat, Dragon',
      worst: 'Tiger',
      description: 'Monkeys share a special bond with Rats and Dragons, matching their intelligence and wit.'
    }
  },
  'Rooster': {
    traits: ['Empathetic', 'creative', 'reliable', 'consistent', 'observant'],
    characteristics: 'Perfect Match WithOX, Bento Buddies With Tiger, Worst Couple With Rabbit, Bento Buddies With Dragon, Perfect Match With Snake, Worst Couple With Horse, Average WithSheep, Average With Monkey, Worst Couple With Rooster, Worst Couple With Dog, Average With Pig, Worst Couple With Rat.',
    compatibility: {
      best: 'Ox, Snake',
      worst: 'Rabbit',
      description: 'Roosters connect well with Oxen and Snakes, sharing their dedication to hard work.'
    }
  },
  'Dog': {
    traits: ['Loyal', 'honest', 'generous', 'playful', 'lovely'],
    characteristics: 'Bento Buddies With Ox, Bento Buddies With Tiger, Perfect Match With Rabbit, Worst Couple With Dragon, Average With Snake, Average With Horse, Worst Couple With Sheep, Bento Buddies With Monkey, Worst Couple With Rooster, Average With Dog, Bento Buddies With Pig, Bento Buddies With Rat.',
    compatibility: {
      best: 'Tiger, Rabbit',
      worst: 'Dragon',
      description: 'Dogs find their perfect matches with Tigers and Rabbits, who value their loyalty and honesty.'
    }
  },
  'Pig': {
    traits: ['Happy', 'generous', 'logical', 'loving', 'compassionate'],
    characteristics: 'Good Match or Enemy With OX, Perfect Match With Tiger, Perfect Match With Rabbit, Good Friend With Dragon, Worst Couple With Snake, Bento Buddies With Horse, Perfect Match With Sheep, Worst Couple With Monkey, Average With Rooster, Bento Buddies With Dog, Good Friend With Pig, Bento Buddies With Rat.',
    compatibility: {
      best: 'Tiger, Rabbit',
      worst: 'Snake',
      description: 'Pigs have wonderful relationships with Tigers and Rabbits, who appreciate their generous nature.'
    }
  }
};,
  'Tiger': {
    traits: ['Courageous', 'candid', 'confident', 'adventurous', 'sensitive'],
    characteristics: 'Worst Couple With OX, Worst Couple With Tiger, Average With Rabbit, Perfect Match Dragon, Worst Couple With Snake, Perfect Match With Horse, Good Friend With Sheep, Worst Couple With Monkey, Bento Buddies With Rooster, Bento Buddies With Dog, Perfect Match With Rat.',
    compatibility: {
      best: 'Horse, Dog',
      worst: 'Monkey',
      description: 'Tigers find their strongest connections with Horses and Dogs, who match their adventurous spirit.'
    }
  },
  'Rabbit': {
    traits: ['Gentle', 'intelligent', 'loving', 'articulate', 'lucky'],
    characteristics: 'Bento Buddies With OX, Average With Tiger, Average With Rabbit, Average With Dragon, Worst Couple With Snake, Average With Horse, Perfect Match With Sheep, Perfect Match With Monkey, Worst Couple With Rooster, Perfect Match With Dog, Perfect Match With Pig, Perfect Match With Rat.',
    compatibility: {
      best: 'Sheep, Dog',
      worst: 'Rooster',
      description: 'Rabbits harmonize wonderfully with Sheep and Dogs, creating peaceful and supportive relationships.'
    }
  },
  'Dragon': {
    traits: ['Strong', 'independent', 'fortunate', 'ambitious', 'confident'],
    characteristics: 'Worst Couple With OX, Perfect Match With Tiger, Average With Rabbit, Good Friend With Dragon, Perfect Match With Snake, Average With Horse, Worst Couple With Sheep, Bento Buddies With Monkey, Bento Buddies With Rooster, Worst Couple With Dog, Average With Pig, Perfect Match With Rat.',
    compatibility: {
      best: 'Rat, Monkey',
      worst: 'Dog',
      description: 'Dragons find their best matches with Rats and Monkeys, who appreciate their strength and ambition.'
    }
  },
  'Snake': {
    traits: ['Ambitious', 'wise', 'intense', 'determined', 'enigmatic'],
    characteristics: 'Bento Buddies With OX, Worst Couple With Tiger, Worst Couple With Rabbit, Perfect Match With Dragon, Worst Couple With Snake, Good Friend With Horse, Worst Couple With Sheep, Good Friend With Monkey, Perfect Match With Rooster, Average With Dog, Worst Couple With Pig, Good Friend With Rat.',
    compatibility: {
      best: 'Dragon, Rooster',
      worst: 'Pig',
      description: 'Snakes connect deeply with Dragons and Roosters, sharing their wisdom and determination.'
    }
  },
  'Horse': {
    traits: ['Energetic', 'free', 'popular', 'positive', 'animated'],
    characteristics: 'Worst Couple With OX, Perfect Match With Tiger, Average With Rabbit, Average With Dragon, Good Friend With Snake, Worst Couple With Horse, Perfect Match With Sheep, Average With Monkey, Worst Couple With Rooster, Average With Dog, Bento Buddies With Pig, Worst Couple With Rat.',
    compatibility: {
      best: 'Tiger, Sheep',
      worst: 'Rat',
      description: 'Horses find their perfect matches with Tigers and Sheep, who understand their need for freedom.'
    }
  },
  'Sheep': {
    traits: ['Kind', 'patient', 'persuasive', 'gentle', 'calm'],
    characteristics: 'Worst Couple WithOX, Average With Tiger, Perfect Match With Rabbit, Worst Couple With Dragon, Worst Couple With Snake, Perfect Match With Horse, Bento Buddies With Sheep, Bento Buddies With Monkey, Average With Rooster, Worst Couple With Dog, Perfect Match With Pig, Good Match or Enemy With Rat.',
    compatibility: {
      best: 'Rabbit, Horse',
      worst: 'Ox',
      description: 'Sheep form harmonious bonds with Rabbits and Horses, who appreciate their gentle nature.'
    }
  },
  'Monkey': {
    traits: ['Intelligent', 'influential', 'curious', 'passionate', 'sharp'],
    characteristics: 'Perfect Match With OX, Worst Couple With Tiger, Perfect Match With Rabbit, Bento Buddies With Dragon, Good Friend With Snake, Average With Horse, Bento Buddies With Sheep, Good Friend With Monkey, Average With Rooster, Bento Buddies With Dog, Worst Couple With Pig, Perfect Match With Rat.',
    compatibility: {
      best: 'Rat, Dragon',
      worst: 'Tiger',
      description: 'Monkeys share a special bond with Rats and Dragons, matching their intelligence and wit.'
    }
  },
  'Rooster': {
    traits: ['Empathetic', 'creative', 'reliable', 'consistent', 'observant'],
    characteristics: 'Perfect Match WithOX, Bento Buddies With Tiger, Worst Couple With Rabbit, Bento Buddies With Dragon, Perfect Match With Snake, Worst Couple With Horse, Average WithSheep, Average With Monkey, Worst Couple With Rooster, Worst Couple With Dog, Average With Pig, Worst Couple With Rat.',
    compatibility: {
      best: 'Ox, Snake',
      worst: 'Rabbit',
      description: 'Roosters connect well with Oxen and Snakes, sharing their dedication to hard work.'
    }
  },
  'Dog': {
    traits: ['Loyal', 'honest', 'generous', 'playful', 'lovely'],
    characteristics: 'Bento Buddies With Ox, Bento Buddies With Tiger, Perfect Match With Rabbit, Worst Couple With Dragon, Average With Snake, Average With Horse, Worst Couple With Sheep, Bento Buddies With Monkey, Worst Couple With Rooster, Average With Dog, Bento Buddies With Pig, Bento Buddies With Rat.',
    compatibility: {
      best: 'Tiger, Rabbit',
      worst: 'Dragon',
      description: 'Dogs find their perfect matches with Tigers and Rabbits, who value their loyalty and honesty.'
    }
  },
  'Pig': {
    traits: ['Happy', 'generous', 'logical', 'loving', 'compassionate'],
    characteristics: 'Good Match or Enemy With OX, Perfect Match With Tiger, Perfect Match With Rabbit, Good Friend With Dragon, Worst Couple With Snake, Bento Buddies With Horse, Perfect Match With Sheep, Worst Couple With Monkey, Average With Rooster, Bento Buddies With Dog, Good Friend With Pig, Bento Buddies With Rat.',
    compatibility: {
      best: 'Tiger, Rabbit',
      worst: 'Snake',
      description: 'Pigs have wonderful relationships with Tigers and Rabbits, who appreciate their generous nature.'
    }
  }
};

// Export all interpretations
// Chinese Zodiac interpretations based on traditional knowledge 
export const zodiacInterpretations: Record<ZodiacSign, {
  traits: string[],
  characteristics: string,
  compatibility: {
    best: string,
    worst: string,
    description: string
  }
}> = {
  'Rat': {
    traits: ['Frugal', 'ambitious', 'honest', 'charming', 'critical'],
    characteristics: 'Ambitious, candid, competitive and congenial, Rats are natural leaders. They have strong interpersonal skills and can easily connect with others.',
    compatibility: {
      best: 'Dragon, Monkey',
      worst: 'Horse',
      description: 'Rats form meaningful relationships with specific Zodiac signs, especially Dragons and Monkeys who complement their ambitious nature.'
    }
  },
  'Ox': {
    traits: ['Perseverant', 'patient', 'hardworking', 'determined', 'stubborn'],
    characteristics: 'The Ox is a pillar of strength in their communities, recognized for their diligence, dependability, and honesty.',
    compatibility: {
      best: 'Snake, Rooster',
      worst: 'Sheep',
      description: 'Forms excellent partnerships with Snake and Rooster. Average with Ox, Worst with Tiger and Horse, Bento Buddies with Rabbit and Dog.'
    }
  },
  'Tiger': {
    traits: ['Courageous', 'candid', 'confident', 'adventurous', 'sensitive'],
    characteristics: 'Worst Couple with Ox and Tiger, Average with Rabbit, Perfect Match with Dragon and Horse, Worst Couple with Snake and Monkey.',
    compatibility: {
      best: 'Horse, Dog',
      worst: 'Monkey',
      description: 'Tigers find their strongest connections with Horses and Dogs, who match their adventurous spirit.'
    }
  },
  'Rabbit': {
    traits: ['Gentle', 'intelligent', 'loving', 'articulate', 'lucky'],
    characteristics: 'Bento Buddies with Ox, Average with Tiger and Dragon, Worst Couple with Snake, Perfect Match with Sheep and Monkey.',
    compatibility: {
      best: 'Sheep, Dog',
      worst: 'Rooster',
      description: 'Rabbits harmonize wonderfully with Sheep and Dogs, creating peaceful and supportive relationships.'
    }
  },
  'Dragon': {
    traits: ['Strong', 'independent', 'fortunate', 'ambitious', 'confident'],
    characteristics: 'Worst Couple with Ox, Perfect Match with Tiger and Snake, Average with Rabbit and Horse, Worst Couple with Sheep and Dog.',
    compatibility: {
      best: 'Rat, Monkey',
      worst: 'Dog',
      description: 'Dragons find their best matches with Rats and Monkeys, who appreciate their strength and ambition.'
    }
  },
  'Snake': {
    traits: ['Ambitious', 'wise', 'intense', 'determined', 'enigmatic'],
    characteristics: 'Bento Buddies with Ox, Worst Couple with Tiger and Rabbit, Perfect Match with Dragon and Rooster, Good Friend with Horse and Monkey.',
    compatibility: {
      best: 'Dragon, Rooster',
      worst: 'Pig',
      description: 'Snakes connect deeply with Dragons and Roosters, sharing their wisdom and determination.'
    }
  },
  'Horse': {
    traits: ['Energetic', 'free', 'popular', 'positive', 'animated'],
    characteristics: 'Worst Couple with Ox and Rat, Perfect Match with Tiger and Sheep, Average with Rabbit and Dragon, Good Friend with Snake.',
    compatibility: {
      best: 'Tiger, Sheep',
      worst: 'Rat',
      description: 'Horses find their perfect matches with Tigers and Sheep, who understand their need for freedom.'
    }
  },
  'Sheep': {
    traits: ['Kind', 'patient', 'persuasive', 'gentle', 'calm'],
    characteristics: 'Worst Couple with Ox and Dragon, Perfect Match with Rabbit and Horse, Bento Buddies with Sheep and Monkey.',
    compatibility: {
      best: 'Rabbit, Horse',
      worst: 'Ox',
      description: 'Sheep form harmonious bonds with Rabbits and Horses, who appreciate their gentle nature.'
    }
  },
  'Monkey': {
    traits: ['Intelligent', 'influential', 'curious', 'passionate', 'sharp'],
    characteristics: 'Perfect Match with Ox and Rabbit, Worst Couple with Tiger, Bento Buddies with Dragon, Good Friend with Snake and Monkey.',
    compatibility: {
      best: 'Rat, Dragon',
      worst: 'Tiger',
      description: 'Monkeys share a special bond with Rats and Dragons, matching their intelligence and wit.'
    }
  },
  'Rooster': {
    traits: ['Empathetic', 'creative', 'reliable', 'consistent', 'observant'],
    characteristics: 'Perfect Match with Ox and Snake, Worst Couple with Rabbit and Horse, Bento Buddies with Tiger and Dragon.',
    compatibility: {
      best: 'Ox, Snake',
      worst: 'Rabbit',
      description: 'Roosters connect well with Oxen and Snakes, sharing their dedication to hard work.'
    }
  },
  'Dog': {
    traits: ['Loyal', 'honest', 'generous', 'playful', 'lovely'],
    characteristics: 'Bento Buddies with Ox and Tiger, Perfect Match with Rabbit, Worst Couple with Dragon, Average with Snake and Horse.',
    compatibility: {
      best: 'Tiger, Rabbit',
      worst: 'Dragon',
      description: 'Dogs find their perfect matches with Tigers and Rabbits, who value their loyalty and honesty.'
    }
  },
  'Pig': {
    traits: ['Happy', 'generous', 'logical', 'loving', 'compassionate'],
    characteristics: 'Good Match or Enemy with Ox, Perfect Match with Tiger and Rabbit, Good Friend with Dragon, Worst Couple with Snake.',
    compatibility: {
      best: 'Tiger, Rabbit',
      worst: 'Snake',
      description: 'Pigs have wonderful relationships with Tigers and Rabbits, who appreciate their generous nature.'
    }
  }
};