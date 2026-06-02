import { Link } from 'react-router-dom'
import { Zap, Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0B0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Web3<span className="gradient-text">Minds</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered Web3 learning for everyone. The Wikipedia for blockchain, built by students.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              {[
                { href: '/glossary', label: 'Glossary' },
                { href: '/learn', label: 'Learn' },
                { href: '/submit', label: 'Submit Term' },
                { href: '/moderation', label: 'Moderation' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/shree016"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <Github size={14} />
                  github.com/shree016
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/shree016/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <Linkedin size={14} />
                  linkedin.com/in/shree016
                </a>
              </li>
              <li>
                <a
                  href="mailto:shrilaxmi016@gmail.com"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <Mail size={14} />
                  shrilaxmi016@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>© 2025 Web3Minds. All rights reserved.</span>
          <span className="text-gray-500">
            Built with <span className="text-pink-500">♥</span> by{' '}
            <span className="text-gray-400">Shrilaxmi Herelagi</span>
          </span>
          <span>Powered by Gemini AI + Ethereum</span>
        </div>
      </div>
    </footer>
  )
}
