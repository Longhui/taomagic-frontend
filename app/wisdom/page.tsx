'use client'

import React, { useState } from 'react'
import { ArrowLeft, BookOpen, ChevronRight, ChevronDown, Circle, Square, Triangle, Wind, Flame, Droplets, Mountain } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

const WISDOM_SECTIONS = [
  {
    id: 'tao',
    title: 'The Tao · 道',
    subtitle: 'The Source of All Things',
    icon: Circle,
    color: 'bronze',
    content: `The Tao (Dao) is the fundamental, unnamable force that underlies and unifies all of reality. Before heaven and earth existed, there was the Tao — formless, eternal, and inexhaustible.

Key Concepts:
- Wu Wei (Non-Action): Not inaction, but action in harmony with the natural flow. Like water finding its path around obstacles.
- Ziran (Naturalness): Being spontaneously oneself, without artificiality or forced effort.
- Pu (Uncarved Block): The uncarved block represents original simplicity before society imposes its patterns.

For Modern Life:
The Tao teaches us to recognize when to push forward and when to yield. In a world of constant striving, the wisdom of Wu Wei reminds us that the most powerful action often looks like no action at all.`
  },
  {
    id: 'yinyang',
    title: 'Yin & Yang · 阴阳',
    subtitle: 'The Dance of Opposites',
    icon: Circle,
    color: 'cinnabar',
    content: `Yin and Yang are not opposing forces but complementary energies that create wholeness. The Yin-Yang symbol (Taijitu) shows how each contains the seed of the other.

Yin Qualities:
- Receptive, dark, cool, inward, feminine, earth, moon, water
- Associated with rest, reflection, and accumulation

Yang Qualities:
- Creative, bright, warm, outward, masculine, heaven, sun, fire
- Associated with action, expression, and expansion

The Dynamic Balance:
No state is permanent. Day becomes night, summer turns to winter. Health, relationships, and success all depend on maintaining dynamic balance between these forces.

Practical Application:
When feeling burned out (excess Yang), cultivate Yin through rest and meditation. When feeling stuck (excess Yin), activate Yang through movement and social connection.`
  },
  {
    id: 'fiveelements',
    title: 'Five Elements · 五行',
    subtitle: 'Wu Xing — The Five Phases',
    icon: Triangle,
    color: 'gold',
    content: `The Five Elements (Wu Xing) describe five fundamental energies and their interactions. Unlike Western elements, these are dynamic processes rather than static substances.

The Five Elements:

WOOD (木) — Growth, expansion, spring
- Direction: East
- Color: Green
- Organ: Liver
- Quality: Vision, planning, upward movement

FIRE (火) — Transformation, peak energy, summer
- Direction: South
- Color: Red
- Organ: Heart
- Quality: Joy, passion, illumination

EARTH (土) — Stability, nourishment, late summer
- Direction: Center
- Color: Yellow
- Organ: Spleen
- Quality: Grounding, harvest, reliability

METAL (金) — Contraction, precision, autumn
- Direction: West
- Color: White
- Organ: Lungs
- Quality: Grief, letting go, value

WATER (水) — Flow, wisdom, winter
- Direction: North
- Color: Black/Blue
- Organ: Kidneys
- Quality: Fear, willpower, adaptability

Generating Cycle (相生):
Wood → Fire → Earth → Metal → Water → Wood

Controlling Cycle (相克):
Wood controls Earth, Earth controls Water, Water controls Fire, Fire controls Metal, Metal controls Wood`
  },
  {
    id: 'bagua',
    title: 'Bagua · 八卦',
    subtitle: 'The Eight Trigrams',
    icon: Square,
    color: 'bronze',
    content: `The Bagua (Eight Trigrams) are the building blocks of I Ching divination and Feng Shui practice. Each trigram consists of three lines — solid (Yang) or broken (Yin).

The Eight Trigrams:

Qian (Heaven) — Pure Yang
- Creativity, strength, fatherhood, leadership
- Direction: Northwest

Kun (Earth) — Pure Yin
- Receptivity, nurturing, motherhood, support
- Direction: Southwest

Zhen (Thunder) — Yang below Yin
- Initiation, movement, shock, new beginnings
- Direction: East

Xun (Wind) — Yin below Yang
- Penetration, gentleness, gradual influence
- Direction: Southeast

Kan (Water) — Yang between Yin
- Danger, depth, wisdom, flowing
- Direction: North

Li (Fire) — Yin between Yang
- Clarity, illumination, beauty, consciousness
- Direction: South

Gen (Mountain) — Yin below Yang
- Stillness, meditation, stopping, boundaries
- Direction: Northeast

Dui (Lake) — Yin above Yang
- Joy, pleasure, communication, openness
- Direction: West

From Trigrams to Hexagrams:
When two trigrams combine (one above, one below), they form one of 64 hexagrams — the complete system of I Ching divination.`
  },
  {
    id: 'heavenly',
    title: 'Heavenly Stems & Earthly Branches · 天干地支',
    subtitle: 'The Chinese Time System',
    icon: Wind,
    color: 'cinnabar',
    content: `The Heavenly Stems (天干) and Earthly Branches (地支) form the traditional Chinese calendar system used in astrology, divination, and Feng Shui.

Ten Heavenly Stems (天干):
1. Jia (甲) — Yang Wood
2. Yi (乙) — Yin Wood
3. Bing (丙) — Yang Fire
4. Ding (丁) — Yin Fire
5. Wu (戊) — Yang Earth
6. Ji (己) — Yin Earth
7. Geng (庚) — Yang Metal
8. Xin (辛) — Yin Metal
9. Ren (壬) — Yang Water
10. Gui (癸) — Yin Water

Twelve Earthly Branches (地支):
1. Zi (子) — Rat — Yang Water (North)
2. Chou (丑) — Ox — Yin Earth
3. Yin (寅) — Tiger — Yang Wood (East)
4. Mao (卯) — Rabbit — Yin Wood (East)
5. Chen (辰) — Dragon — Yang Earth
6. Si (巳) — Snake — Yin Fire (South)
7. Wu (午) — Horse — Yang Fire (South)
8. Wei (未) — Goat — Yin Earth
9. Shen (申) — Monkey — Yang Metal (West)
10. You (酉) — Rooster — Yin Metal (West)
11. Xu (戌) — Dog — Yang Earth
12. Hai (亥) — Pig — Yin Water (North)

The 60-Year Cycle:
Stems and Branches combine to create a 60-year cycle (甲子). Your birth year stem-branch combination is part of your Ba Zi (八字) destiny chart.`
  },
  {
    id: 'divination',
    title: 'I Ching Divination · 易经预测',
    subtitle: 'The Book of Changes',
    icon: Flame,
    color: 'gold',
    content: `The I Ching (易经) is one of the oldest books in the world, used for divination and philosophical guidance for over 3,000 years.

How Divination Works:

1. Formulate Your Question: Ask something specific and meaningful. The I Ching responds to sincere inquiry.

2. Generate a Hexagram: Traditionally done with 50 yarrow stalks or three coins. Each method produces one of 64 hexagrams.

3. Read the Text: Each hexagram has a main text (Gua Ci) and six line texts (Yao Ci) that provide guidance.

4. Changing Lines: If any lines are "changing" (old Yin or old Yang), they transform into their opposite, creating a second hexagram that shows the future development.

Types of Questions Suitable for I Ching:
- Should I take this job offer?
- What is the nature of this relationship?
- How should I approach this conflict?
- What do I need to understand about my current situation?

What NOT to Ask:
- Lottery numbers or gambling outcomes
- Medical diagnoses (consult doctors)
- Questions about others without their knowledge
- The same question repeatedly in short time`
  },
  {
    id: 'fengshui',
    title: 'Feng Shui · 风水',
    subtitle: 'Wind & Water — The Art of Placement',
    icon: Droplets,
    color: 'bronze',
    content: `Feng Shui (风水) literally means "Wind and Water" — the art of arranging space to harmonize with the natural flow of energy (Qi).

Core Principles:

1. Qi (气) Flow: Energy should flow smoothly through a space, neither too fast (rushing) nor too slow (stagnant).

2. Command Position: The most important furniture (bed, desk, stove) should have a clear view of the door while not being directly in line with it.

3. Five Elements Balance: Each area of life benefits from specific elemental energies.

4. Yin-Yang Balance: Spaces need both active (Yang) and restful (Yin) areas.

The Bagua Map (Energy Grid):
Overlay this grid on your home, with the door at the bottom:

Knowledge | Career | Helpful People
Family    | Center | Children
Wealth    | Fame   | Relationships

Quick Fixes for Common Issues:
- Clutter: Blocks Qi flow. Clear regularly.
- Sharp Corners: Create "poison arrows." Soften with plants.
- Dark Entry: Weakens career. Add light and vibrant art.
- Bed Under Beam: Creates pressure. Move bed or soften beam.`
  },
  {
    id: 'eightmansions',
    title: 'Eight Mansions · 八宅明镜',
    subtitle: 'Ba Zhai Ming Jing — Directional Feng Shui',
    icon: Mountain,
    color: 'cinnabar',
    content: `The Eight Mansions (八宅) system is one of the most practical Feng Shui methods for home arrangement, based on your personal Gua number and directional energies.

Calculate Your Gua Number:

For Men: (100 - birth year last two digits) ÷ 9, remainder is Gua
For Women: (birth year last two digits - 4) ÷ 9, remainder is Gua

The Eight Directions:

Four Auspicious Directions:
1. Sheng Qi (生气) — Vitality, prosperity, growth
2. Tian Yi (天医) — Health, healing, well-being
3. Yan Nian (延年) — Longevity, stability, relationships
4. Fu Wei (伏位) — Harmony, peace, self-cultivation

Four Inauspicious Directions:
1. Jue Ming (绝命) — Death, misfortune, accidents
2. Wu Gui (五鬼) — Five Ghosts, chaos, conflict
3. Liu Sha (六煞) — Six Killings, stress, illness
4. Huo Hai (祸害) — Mishaps, obstacles, setbacks

Practical Application:
- Sleep with your head pointing to your Sheng Qi direction
- Place your desk facing Tian Yi for health
- Position your stove in Yan Nian for family harmony
- Avoid placing important activities in inauspicious directions`
  }
]

const SectionCard = ({ section, isOpen, onToggle }: { 
  section: typeof WISDOM_SECTIONS[0]; 
  isOpen: boolean; 
  onToggle: () => void 
}) => {
  const Icon = section.icon
  const colorMap: Record<string, string> = {
    bronze: 'text-bronze border-bronze/30 bg-bronze/5',
    cinnabar: 'text-cinnabar border-cinnabar/30 bg-cinnabar/5',
    gold: 'text-gold border-gold/30 bg-gold/5',
  }

  return (
    <div className={`rounded-lg border overflow-hidden transition-all ${isOpen ? 'shadow-md' : ''} ${colorMap[section.color]}`}>
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center gap-4 text-left hover:bg-black/5 transition-colors"
      >
        <div className={`p-3 rounded-lg bg-white/80`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif">{section.title}</h3>
          <p className="text-sm opacity-70">{section.subtitle}</p>
        </div>
        <ChevronDown 
          size={20} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div className="bg-white/80 rounded-lg p-6">
            <div className="prose prose-stone max-w-none">
              {section.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('Key Concepts:') || paragraph.startsWith('Yin Qualities:') || paragraph.startsWith('Yang Qualities:') || paragraph.startsWith('The Dynamic Balance:') || paragraph.startsWith('Practical Application:') || paragraph.startsWith('The Five Elements:') || paragraph.startsWith('Generating Cycle') || paragraph.startsWith('Controlling Cycle') || paragraph.startsWith('The Eight Trigrams:') || paragraph.startsWith('From Trigrams') || paragraph.startsWith('Ten Heavenly') || paragraph.startsWith('Twelve Earthly') || paragraph.startsWith('The 60-Year') || paragraph.startsWith('How Divination') || paragraph.startsWith('Types of Questions') || paragraph.startsWith('What NOT') || paragraph.startsWith('Core Principles:') || paragraph.startsWith('The Bagua Map') || paragraph.startsWith('Quick Fixes') || paragraph.startsWith('Calculate Your') || paragraph.startsWith('The Eight Directions:') || paragraph.startsWith('Four Auspicious') || paragraph.startsWith('Four Inauspicious') || paragraph.startsWith('Practical Application:')) {
                  return <h4 key={i} className="font-serif text-lg mt-4 mb-2">{paragraph}</h4>
                }
                if (paragraph.startsWith('WOOD') || paragraph.startsWith('FIRE') || paragraph.startsWith('EARTH') || paragraph.startsWith('METAL') || paragraph.startsWith('WATER') || paragraph.startsWith('Qian') || paragraph.startsWith('Kun') || paragraph.startsWith('Zhen') || paragraph.startsWith('Xun') || paragraph.startsWith('Kan') || paragraph.startsWith('Li') || paragraph.startsWith('Gen') || paragraph.startsWith('Dui') || paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.')) {
                  return <div key={i} className="bg-stone-50 p-3 rounded-sm mb-2 text-sm">{paragraph}</div>
                }
                return <p key={i} className="mb-3 leading-relaxed text-ink/80">{paragraph}</p>
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function WisdomPage() {
  const [openSection, setOpenSection] = useState<string | null>('tao')

  return (
    <div className="min-h-screen bg-rice pt-16">
      <Navigation solid />

      {/* Hero */}
      <div className="bg-ink text-rice py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen size={48} className="text-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Yi Jing Wisdom</h1>
          <p className="text-xl text-rice/60">易经知识 · Ancient Knowledge for Modern Seekers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg border border-ink/10 p-8 mb-8">
          <p className="text-ink/80 leading-relaxed text-lg">
            The I Ching (易经) — Book of Changes — is one of humanity's oldest wisdom traditions, 
            dating back over 3,000 years. These teachings on the Tao, Yin-Yang, Five Elements, 
            and the nature of change have guided emperors, philosophers, and ordinary people 
            through life's decisions and transformations.
          </p>
          <p className="text-ink/60 mt-4">
            Explore the sections below to build your understanding. Each opens a gateway 
            to practical wisdom you can apply immediately.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {WISDOM_SECTIONS.map(section => (
            <SectionCard
              key={section.id}
              section={section}
              isOpen={openSection === section.id}
              onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-bronze/10 to-gold/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-serif text-ink mb-4">Ready to Apply This Wisdom?</h3>
          <p className="text-ink/70 mb-6">
            Knowledge becomes power when put into practice. Try a free I Ching reading 
            or explore our curated Feng Shui objects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/divination" className="bg-cinnabar text-rice px-6 py-3 rounded-sm hover:bg-cinnabar/80 transition-colors inline-flex items-center justify-center gap-2">
              <Flame size={18} />
              Try I Ching Reading
            </Link>
            <Link href="/shop" className="border border-ink/30 text-ink px-6 py-3 rounded-sm hover:bg-ink/5 transition-colors inline-flex items-center justify-center gap-2">
              <ChevronRight size={18} />
              Browse Feng Shui Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
