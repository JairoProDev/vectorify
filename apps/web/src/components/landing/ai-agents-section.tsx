'use client';

import { useTranslations } from '@/i18n/hooks';
import { useState } from 'react';
import { 
  Briefcase, 
  Smartphone, 
  BarChart3, 
  Wrench, 
  Scale, 
  FlaskConical, 
  Dumbbell,
  Bot
} from 'lucide-react';

const agents = [
  {
    id: 'strategist',
    icon: Briefcase,
    gradient: 'from-blue-500 to-indigo-600',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'productManager',
    icon: Smartphone,
    gradient: 'from-primary to-purple-600',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'marketAnalyst',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-green-600',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'techArchitect',
    icon: Wrench,
    gradient: 'from-orange-500 to-red-600',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'legalAdvisor',
    icon: Scale,
    gradient: 'from-slate-500 to-zinc-600',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
  },
  {
    id: 'validationLead',
    icon: FlaskConical,
    gradient: 'from-cyan-500 to-teal-600',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'accountabilityCoach',
    icon: Dumbbell,
    gradient: 'from-pink-500 to-rose-600',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
];

export function AIAgentsSection() {
  const t = useTranslations('landing');
  const [activeAgent, setActiveAgent] = useState(agents[0].id);

  const currentAgent = agents.find(a => a.id === activeAgent) || agents[0];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="agents">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />
      <div className="absolute inset-0 pattern-dots opacity-20" />
      
      {/* Animated Orb */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('agents.badge')}
            </span>
          </div>
          
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('agents.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('agents.title.line2')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('agents.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Agent Selector */}
          <div className="lg:col-span-2 space-y-3">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl
                  transition-all duration-300 text-left
                  ${activeAgent === agent.id 
                    ? 'bg-card border-2 border-primary/50 shadow-glow-sm' 
                    : 'bg-card/50 border border-white/5 hover:border-white/10 hover:bg-card'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 rounded-xl flex-shrink-0
                  bg-gradient-to-br ${agent.gradient}
                  flex items-center justify-center
                  ${activeAgent === agent.id ? 'scale-110' : ''}
                  transition-transform duration-300
                `}>
                  <agent.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold truncate ${activeAgent === agent.id ? 'text-primary' : 'text-foreground'}`}>
                    {t(`agents.list.${agent.id}.name`)}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {t(`agents.list.${agent.id}.role`)}
                  </p>
                </div>
                {activeAgent === agent.id && (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Agent Detail */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 p-8 rounded-2xl bg-card border border-white/10 gradient-border">
              {/* Header */}
              <div className="flex items-start gap-6 mb-8">
                <div className={`
                  w-20 h-20 rounded-2xl flex-shrink-0
                  bg-gradient-to-br ${currentAgent.gradient}
                  flex items-center justify-center
                  shadow-glow
                `}>
                  <currentAgent.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {t(`agents.list.${currentAgent.id}.name`)}
                  </h3>
                  <p className={`text-sm ${currentAgent.color}`}>
                    {t(`agents.list.${currentAgent.id}.role`)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t(`agents.list.${currentAgent.id}.personality`)}
                  </p>
                </div>
              </div>

              {/* Expertise */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  {t('agents.expertise')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['a', 'b', 'c', 'd', 'e'].map((item) => (
                    <span 
                      key={item}
                      className={`px-3 py-1 rounded-full text-xs ${currentAgent.bgColor} ${currentAgent.color}`}
                    >
                      {t(`agents.list.${currentAgent.id}.skills.${item}`)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Example Intervention */}
              <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {t('agents.intervention')}
                </h4>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${currentAgent.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <currentAgent.icon className={`w-4 h-4 ${currentAgent.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{t(`agents.list.${currentAgent.id}.example`)}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}





