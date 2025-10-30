import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  path: string
  gradient: string
}

export function ServiceCard({ title, description, icon, path, gradient }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link to={path} className="block h-full">
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full bg-gradient-to-br ${gradient} border border-white/10 shadow-xl hover:shadow-2xl transition-shadow active:shadow-lg touch-manipulation`}>
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <div className="text-5xl sm:text-6xl">{icon}</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
            <p className="text-mystic-200 text-xs sm:text-sm leading-relaxed">
              {description}
            </p>
            <div className="pt-1 sm:pt-2">
              <span className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg text-white text-xs sm:text-sm font-medium transition">
                开始占卜 →
              </span>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
          <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />
        </div>
      </Link>
    </motion.div>
  )
}
