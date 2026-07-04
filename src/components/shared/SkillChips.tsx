'use client';

import { cn } from '@/lib/utils';

const ALL_SKILLS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'Go', 'Rust', 'Java',
  'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Docker', 'Kubernetes', 'AWS',
  'Vue.js', 'Angular', 'Next.js', 'Django', 'Flutter', 'GraphQL', 'MongoDB',
  'PostgreSQL', 'Redis',
];

const SKILL_COLORS = [
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-red-500/20 text-red-400 border-red-500/30',
];

function getSkillColor(skill: string, selected: boolean): string {
  if (!selected) return 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10';
  const idx = ALL_SKILLS.indexOf(skill);
  return SKILL_COLORS[idx % SKILL_COLORS.length];
}

interface Props {
  selected: string[];
  onChange: (skills: string[]) => void;
}

export function SkillChips({ selected, onChange }: Props) {
  const toggle = (skill: string) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_SKILLS.map((skill) => {
        const isSelected = selected.includes(skill);
        return (
          <button
            key={skill}
            type="button"
            onClick={() => toggle(skill)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              getSkillColor(skill, isSelected)
            )}
          >
            {skill}
          </button>
        );
      })}
    </div>
  );
}