/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ChefHat, 
  Clock, 
  Utensils, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  ChevronDown,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateRecipe, Recipe } from "./services/gemini";

export default function App() {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newRecipe = await generateRecipe({ ingredients, cuisine, diet, mood });
      setRecipe(newRecipe);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecipe(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary font-sans selection:bg-brand-gold/30">
      {/* Subtle background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10" 
          style={{ background: 'radial-gradient(circle, #C5A059 0%, transparent 70%)', filter: 'blur(100px)' }}
        />
      </div>

      {/* Header */}
      <header className="px-6 py-8 border-b border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6 group cursor-pointer">
            <h1 className="font-serif text-3xl italic tracking-tight font-bold">Savor</h1>
            <div className="h-px w-12 bg-white/10 hidden sm:block"></div>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 hidden sm:block">
              FlavorFinder
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium opacity-50 uppercase tracking-widest italic">
            Curated Gastronomy
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <AnimatePresence mode="wait">
          {!recipe ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <h2 className="font-serif text-6xl md:text-8xl font-light leading-tight">
                  What shall we <br />
                  <span className="italic gold-text text-brand-gold">discover</span> today?
                </h2>
                <p className="max-w-lg mx-auto text-lg opacity-50 font-light">
                  Input your pantry essentials or a fleeting craving. Let savor guide your next culinary masterpiece.
                </p>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="glass rounded-[40px] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                        <Utensils size={12} /> Ingredients
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          const surprises = [
                            { i: "Lobster tail, saffron, shallots, heavy cream", c: "French", m: "Opulent Dinner" },
                            { i: "Black garlic, ribeye steak, rosemary", c: "Modern Grill", m: "Technical Challenge" },
                            { i: "Duck leg, port-glazed figs, star anise", c: "Autumnal Feast", m: "Evening Party" },
                            { i: "Sea bass, lemongrass, ginger, bok choy", c: "South-East Asian", m: "Light Wellness" }
                          ];
                          const s = surprises[Math.floor(Math.random() * surprises.length)];
                          setIngredients(s.i);
                          setCuisine(s.c);
                          setMood(s.m);
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-white transition-colors"
                      >
                        Surprise me
                      </button>
                    </div>
                    <textarea
                      placeholder="Enter elements..."
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[160px] focus:ring-1 focus:ring-brand-gold outline-none transition-all resize-none text-sm placeholder:opacity-20"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                        <Sparkles size={12} /> Cuisine
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Continental, Thai..."
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-brand-gold outline-none transition-all text-sm placeholder:opacity-20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Dietary</label>
                      <input
                        type="text"
                        placeholder="Constraints..."
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-brand-gold outline-none transition-all text-sm placeholder:opacity-20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Mood</label>
                      <input
                        type="text"
                        placeholder="Mood or Occasion..."
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-brand-gold outline-none transition-all text-sm placeholder:opacity-20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 pt-12 relative z-10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-brand-gold text-black px-16 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <RotateCcw className="animate-spin" size={16} />
                        Creating Essence...
                      </>
                    ) : (
                      <>
                        Reveal Recipe
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  {error && <p className="text-brand-gold text-xs font-medium tracking-wide uppercase">{error}</p>}
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="recipe"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, type: "spring", damping: 25 }}
              className="space-y-12 pb-32"
            >
              <button 
                onClick={handleReset}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] opacity-30 hover:opacity-100 transition-opacity"
              >
                <RotateCcw size={14} /> Back to Library
              </button>

              <div className="glass rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10">
                <div className="h-1 bg-brand-gold w-full opacity-60" />
                
                <div className="p-8 md:p-20 space-y-20">
                  <div className="space-y-8 text-center max-w-3xl mx-auto">
                    <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/80">
                      <span className="flex items-center gap-2"><Clock size={12} /> {recipe.cookingTime}</span>
                      <span className="flex items-center gap-2"><Flame size={12} /> {recipe.difficulty}</span>
                    </div>
                    <h2 className="font-serif text-6xl md:text-8xl text-text-primary leading-[1.1] font-light">
                      {recipe.name.split(' with ').map((part, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {i > 0 ? <span className="italic font-normal opacity-70">with {part}</span> : part}
                        </span>
                      ))}
                    </h2>
                    <p className="text-xl italic opacity-50 leading-relaxed font-serif max-w-xl mx-auto border-y border-white/5 py-8">
                      “{recipe.description}”
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                    {/* Ingredients */}
                    <div className="md:col-span-4 space-y-10">
                      <h3 className="font-serif text-3xl italic gold-text border-b border-white/10 pb-6">
                        Provisions
                      </h3>
                      <ul className="space-y-6">
                        {recipe.ingredients.map((item, i) => (
                          <li key={i} className="flex gap-4 text-sm font-light leading-relaxed group">
                            <span className="text-brand-gold opacity-30 group-hover:opacity-100 transition-opacity">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div className="md:col-span-8 space-y-10">
                      <h3 className="font-serif text-3xl italic gold-text border-b border-white/10 pb-6">
                        The Preparation
                      </h3>
                      <ol className="space-y-12">
                        {recipe.instructions.map((step, i) => (
                          <li key={i} className="group relative pl-16">
                            <span className="absolute left-0 top-0 font-serif text-4xl italic font-light text-white/5 group-hover:text-brand-gold transition-colors leading-none">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="text-lg font-light leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                              {step}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Tips Section */}
                  {recipe.tips && recipe.tips.length > 0 && (
                    <div className="glass rounded-[32px] p-10 border border-brand-gold/10 space-y-6">
                      <h4 className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.3em] text-brand-gold opacity-60">
                        <Info size={14} /> Master's Journal
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recipe.tips.map((tip, i) => (
                          <p key={i} className="text-sm opacity-40 italic leading-relaxed border-l border-brand-gold/20 pl-6">
                            {tip}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center p-16 opacity-10 text-[10px] uppercase tracking-[0.4em] relative z-10">
        &copy; {new Date().getFullYear()} Savor &bull; Modern Culinary Artificial Intelligence
      </footer>
    </div>
  );
}

