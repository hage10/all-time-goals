import React from 'react';

// X (Twitter) Icon SVG from LF function in index-D7OfHMJl.js
const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

interface FooterProps {
  totalGoals?: number;
  totalAssists?: number;
}

export const Footer: React.FC<FooterProps> = ({
  totalGoals = 927,
  totalAssists = 332,
}) => {
  return (
    <footer className="relative bg-[#070708] border-t border-white/[0.07] pt-14 pb-24 md:pb-12 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1180px]">
        {/* Main 4-column Grid matching exact original structure */}
        <div className="grid gap-10 md:gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Column 1: Brand, stats, social links */}
          <div className="min-w-0">
            <a href="/" className="inline-flex items-center gap-2.5 group">
              <img src="/icon.png" alt="Messi All Goals" className="h-8 w-8 rounded-lg" />
              <span className="font-display text-[15px] font-black uppercase italic tracking-[-0.02em] text-white">
                Messi<span className="text-primary"> All Goals</span>
              </span>
            </a>
            <p className="text-[12.5px] leading-relaxed text-white/35 mt-4 max-w-[280px]">
              Every Lionel Messi career goal, assist, and landmark strike from 2004 to 2026 in full HD.
            </p>
            <div className="flex items-center gap-6 mt-6">
              <span className="block">
                <span className="num block text-[20px] leading-none text-white">
                  {totalGoals || '—'}
                </span>
                <span className="label block mt-1.5">Goals</span>
              </span>
              <span className="block">
                <span className="num block text-[20px] leading-none text-white">
                  {totalAssists || '—'}
                </span>
                <span className="label block mt-1.5">Assists</span>
              </span>
            </div>
            <div className="flex items-center gap-5 mt-7">
              <a
                href="https://twitter.com/hardhurtagaa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                title="X"
                className="text-white/30 hover:text-primary transition-colors"
              >
                <XTwitterIcon className="w-[17px] h-[17px]" />
              </a>
              <a
                href="https://instagram.com/_messiallgoals_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="text-white/30 hover:text-primary transition-colors"
              >
                <InstagramIcon className="w-[17px] h-[17px]" />
              </a>
              <a
                href="https://discord.gg/exQawwch6p"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                title="Discord"
                className="text-white/30 hover:text-primary transition-colors"
              >
                <DiscordIcon className="w-[17px] h-[17px]" />
              </a>
            </div>
          </div>

          {/* Column 2: Archive */}
          <div className="min-w-0">
            <span className="label block mb-4">Archive</span>
            <ul className="space-y-2.5">
              <li>
                <a href="/" className="text-[12.5px] font-medium text-white/45 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/shotmapper" className="text-[12.5px] font-medium text-white/45 hover:text-white transition-colors">
                  Shot Map
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="min-w-0">
            <span className="label block mb-4">Support</span>
            <ul className="space-y-2.5">
              <li>
                <a href="/support" className="text-[12.5px] font-medium text-white/45 hover:text-white transition-colors">
                  Support Us
                </a>
              </li>
              <li>
                <a href="/how-to-pwa" className="text-[12.5px] font-medium text-white/45 hover:text-white transition-colors">
                  Get the app
                </a>
              </li>
              <li>
                <button
                  onClick={() => window.open('https://buymeacoffee.com/messiallgoals1', '_blank')}
                  className="text-[12.5px] font-medium text-white/45 hover:text-white transition-colors text-left"
                >
                  Monthly Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="min-w-0">
            <span className="label block mb-4">Company</span>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => window.open('mailto:messiallgoals10@gmail.com?subject=Investment Opportunity Inquiry', '_blank')}
                  className="text-[12.5px] font-medium text-white/45 hover:text-white transition-colors text-left"
                >
                  Investment Opportunities
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.open('mailto:messiallgoals10@gmail.com?subject=Platform Acquisition Inquiry', '_blank')}
                  className="text-[12.5px] font-medium text-white/45 hover:text-white transition-colors text-left"
                >
                  Acquisition Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.open('mailto:messiallgoals10@gmail.com', '_blank')}
                  className="text-[12.5px] font-medium text-white/45 hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer line: copyright, links, and disclaimer */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col-reverse md:flex-row md:items-center gap-5 md:gap-8">
          <span className="label shrink-0">© {new Date().getFullYear()} Messi All Goals</span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-2 shrink-0">
            <a href="/privacy-policy" className="label hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="label hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="/cookie-policy" className="label hover:text-primary transition-colors">
              Cookie Policy
            </a>
            <a href="/takedown" className="label hover:text-primary transition-colors">
              Copyright & takedown
            </a>
          </span>
          <p className="md:ml-auto md:text-right text-[10.5px] leading-relaxed text-white/20 md:max-w-[420px]">
            Messi All Goals is a fan-made archive celebrating Lionel Messi's career. Not affiliated with Lionel Messi, FC Barcelona, PSG, Inter Miami CF, or AFA.
          </p>
        </div>

        {/* Data Credits paragraph */}
        <p className="mt-5 text-[10.5px] leading-relaxed text-white/20">
          Shot positions for La Liga, the 2022 World Cup and Ligue 1 come from{' '}
          <a
            href="https://github.com/statsbomb/open-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-primary underline underline-offset-2 decoration-white/15"
          >
            StatsBomb Open Data
          </a>
          . Goal details were cross-checked against{' '}
          <a
            href="https://www.kaggle.com/datasets/leancorv/all-messi-goals-20052026"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-primary underline underline-offset-2 decoration-white/15"
          >
            All Messi Goals (2005–2026)
          </a>{' '}
          by leancorv,{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-primary underline underline-offset-2 decoration-white/15"
          >
            CC BY-SA 4.0
          </a>{' '}
          — twenty-five records here were corrected to match it.
        </p>
      </div>
    </footer>
  );
};
