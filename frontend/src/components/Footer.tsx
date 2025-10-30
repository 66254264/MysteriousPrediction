export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-2 sm:mb-3">关于我们</h3>
            <p className="text-mystic-300 text-xs sm:text-sm">
              探索神秘的占卜世界，获得人生的指引和启示。
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-2 sm:mb-3">占卜服务</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-mystic-300 text-xs sm:text-sm">
              <li>塔罗牌占卜</li>
              <li>星座运势</li>
              <li>生辰八字</li>
              <li>周易占卜</li>
            </ul>
          </div>
          
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-white font-bold text-base sm:text-lg mb-2 sm:mb-3">联系方式</h3>
            <p className="text-mystic-300 text-xs sm:text-sm">
              本网站仅供娱乐参考<br />
              请理性对待占卜结果
            </p>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 text-center text-mystic-400 text-xs sm:text-sm">
          © 2024 神秘预测网站. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
