import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple';
  trend?: string;
}

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  color = 'blue',
  trend,
}: StatCardProps) {
  const colorSchemes = {
    blue: {
      iconBg: 'bg-pink-50 text-fuchsia-600',
      badge: 'text-fuchsia-700 bg-pink-50',
    },
    indigo: {
      iconBg: 'bg-violet-50 text-violet-600',
      badge: 'text-violet-700 bg-violet-50',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      badge: 'text-emerald-700 bg-emerald-50',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      badge: 'text-amber-700 bg-amber-50',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600',
      badge: 'text-purple-700 bg-purple-50',
    },
  };

  const scheme = colorSchemes[color];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h4>
        {(subtext || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {trend && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-sm ${scheme.badge}`}>
                {trend}
              </span>
            )}
            {subtext && <span className="text-xs text-gray-500">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
