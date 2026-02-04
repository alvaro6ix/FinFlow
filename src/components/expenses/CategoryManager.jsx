import React, { useState, useMemo } from "react";
import { useCategoryStore } from "../../stores/categoryStore";
import { useAuthStore } from "../../stores/authStore";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { 
  X, Plus, Trash2, EyeOff, Eye, Pencil, Check, Search,
  Utensils, Car, Home, Film, Pill, Book, Shirt, 
  HelpCircle, Coffee, ShoppingBag, Dumbbell, Plane, 
  Gift, Heart, Music, Camera, Wrench, Star, Zap,
  Smartphone, Monitor, Laptop, Gamepad2, Pizza, 
  Beer, Baby, Dog, Cat, TreePine, Umbrella, 
  Briefcase, GraduationCap, CreditCard, Banknote, 
  Wallet, Landmark, Receipt, TrendingUp, PiggyBank,
  ShieldCheck, ShoppingCart, Truck, Factory, Construction
} from "lucide-react";
import Button from "../common/Button";

// ✅ BIBLIOTECA COMPARTIDA
export const ICON_LIBRARY = [
  { name: "Utensils", icon: Utensils, tags: "comida, restaurante, alimentos" },
  { name: "Pizza", icon: Pizza, tags: "comida, cena, chatarra" },
  { name: "Coffee", icon: Coffee, tags: "bebida, cafe, desayuno" },
  { name: "Beer", icon: Beer, tags: "alcohol, fiesta, bar" },
  { name: "Car", icon: Car, tags: "transporte, gasolina, viaje" },
  { name: "Plane", icon: Plane, tags: "viaje, vacaciones, vuelo" },
  { name: "Truck", icon: Truck, tags: "envio, mudanza, entrega" },
  { name: "Home", icon: Home, tags: "casa, vivienda, renta" },
  { name: "Construction", icon: Construction, tags: "reparacion, obra, casa" },
  { name: "Wrench", icon: Wrench, tags: "herramientas, mantenimiento, reparar" },
  { name: "Film", icon: Film, tags: "cine, entretenimiento, pelicula" },
  { name: "Music", icon: Music, tags: "musica, concierto, ocio" },
  { name: "Gamepad2", icon: Gamepad2, tags: "juegos, ocio, diversion" },
  { name: "Monitor", icon: Monitor, tags: "tecnologia, trabajo, tv" },
  { name: "Smartphone", icon: Smartphone, tags: "celular, plan, tech" },
  { name: "Pill", icon: Pill, tags: "salud, medicina, farmacia" },
  { name: "Dumbbell", icon: Dumbbell, tags: "gym, ejercicio, salud" },
  { name: "Heart", icon: Heart, tags: "amor, salud, pareja" },
  { name: "Book", icon: Book, tags: "educacion, lectura, escuela" },
  { name: "GraduationCap", icon: GraduationCap, tags: "estudio, universidad, curso" },
  { name: "Shirt", icon: Shirt, tags: "ropa, compras, moda" },
  { name: "ShoppingBag", icon: ShoppingBag, tags: "compras, tienda" },
  { name: "ShoppingCart", icon: ShoppingCart, tags: "super, mercado" },
  { name: "Gift", icon: Gift, tags: "regalo, fiesta, cumple" },
  { name: "PiggyBank", icon: PiggyBank, tags: "ahorro, inversion" },
  { name: "TrendingUp", icon: TrendingUp, tags: "ganancia, mercado, bolsa" },
  { name: "Banknote", icon: Banknote, tags: "efectivo, dinero" },
  { name: "Wallet", icon: Wallet, tags: "billetera, dinero" },
  { name: "Landmark", icon: Landmark, tags: "banco, gobierno" },
  { name: "Briefcase", icon: Briefcase, tags: "trabajo, negocio" },
  { name: "Baby", icon: Baby, tags: "bebe, hijos" },
  { name: "Dog", icon: Dog, tags: "mascota, perro, veterinario" },
  { name: "Cat", icon: Cat, tags: "mascota, gato" },
  { name: "Zap", icon: Zap, tags: "luz, energia, electricidad" },
  { name: "Umbrella", icon: Umbrella, tags: "seguro, clima" },
  { name: "ShieldCheck", icon: ShieldCheck, tags: "seguridad, suscripcion" },
  { name: "Star", icon: Star, tags: "favorito, especial" },
  { name: "HelpCircle", icon: HelpCircle, tags: "otros, duda" }
];

export default function CategoryManager({ onClose }) {
  const { user } = useAuthStore();
  const { customCategories, addCategory, updateCategory, deleteCategory, hiddenSystemIds, toggleHideSystemCategory } = useCategoryStore();
  
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  
  const [form, setForm] = useState({ 
    label: "", iconName: "Star", color: "#6366f1", subcategories: "" 
  });

  const filteredIcons = useMemo(() => {
    const search = iconSearch.toLowerCase();
    return ICON_LIBRARY.filter(i => 
      i.name.toLowerCase().includes(search) || 
      i.tags.toLowerCase().includes(search)
    );
  }, [iconSearch]);

  const handleSave = async () => {
    if (!form.label) return;
    const subList = form.subcategories.split(",").map(s => ({ 
      id: s.trim().toLowerCase().replace(/\s+/g, '_'), 
      label: s.trim() 
    })).filter(s => s.label);

    const data = { ...form, subcategories: subList };

    if (editingId) {
      await updateCategory(editingId, data);
      setEditingId(null);
    } else {
      await addCategory(user.uid, data);
    }
    setShowAdd(false);
    setForm({ label: "", iconName: "Star", color: "#6366f1", subcategories: "" });
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setShowAdd(true);
    setForm({
      label: cat.label,
      iconName: cat.iconName || "Star",
      color: cat.color,
      subcategories: cat.subcategories?.map(s => s.label).join(", ") || ""
    });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans text-secondary-900 dark:text-white">
      <div className="bg-white dark:bg-secondary-900 w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Categorías</h2>
          <button onClick={onClose} className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full active:scale-90 transition-transform"><X size={20}/></button>
        </div>

        {showAdd ? (
          <div className="mb-8 p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-800 animate-in zoom-in-95">
            <h3 className="text-[10px] font-black uppercase text-indigo-600 mb-4 tracking-[0.2em]">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Nombre (Ej: Gimnasio)" 
                className="w-full p-4 rounded-2xl bg-white dark:bg-secondary-800 border-none font-bold text-sm shadow-inner text-secondary-900 dark:text-white" 
                value={form.label} onChange={e => setForm({...form, label: e.target.value})}
              />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                   <p className="text-[9px] font-black uppercase text-secondary-400">Elegir Icono</p>
                   <div className="relative w-32">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-secondary-300" size={10} />
                      <input 
                        type="text" placeholder="Buscar..." 
                        className="w-full pl-6 pr-2 py-1 bg-white dark:bg-secondary-800 rounded-full text-[9px] font-bold border-none outline-none ring-1 ring-secondary-100 dark:ring-secondary-700"
                        value={iconSearch} onChange={e => setIconSearch(e.target.value)}
                      />
                   </div>
                </div>
                
                <div className="grid grid-cols-6 gap-2 p-3 bg-white dark:bg-secondary-800 rounded-[1.5rem] max-h-40 overflow-y-auto shadow-inner">
                  {filteredIcons.map(item => (
                    <button 
                      key={item.name}
                      onClick={() => setForm({...form, iconName: item.name})}
                      className={`p-3 rounded-xl flex justify-center transition-all ${form.iconName === item.name ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700'}`}
                    >
                      <item.icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-secondary-400 ml-2">Color</p>
                  <input type="color" className="w-full h-12 rounded-2xl cursor-pointer bg-white dark:bg-secondary-800 p-1 border-none shadow-inner" value={form.color} onChange={e => setForm({...form, color: e.target.value})}/>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[9px] font-black uppercase text-secondary-400">Vista Previa</p>
                  <div className="h-12 w-12 mx-auto rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: form.color }}>
                    {(() => {
                      const IconObj = ICON_LIBRARY.find(i => i.name === form.iconName);
                      const ActiveIcon = IconObj ? IconObj.icon : HelpCircle;
                      return <ActiveIcon size={24} />;
                    })()}
                  </div>
                </div>
              </div>

              <textarea 
                placeholder="Subcategorías (separadas por coma)" 
                className="w-full p-4 rounded-2xl bg-white dark:bg-secondary-800 border-none text-xs font-bold shadow-inner" 
                value={form.subcategories} onChange={e => setForm({...form, subcategories: e.target.value})}
              />
              
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" fullWidth className="py-4" onClick={() => { setShowAdd(false); setEditingId(null); }}>Cancelar</Button>
                <Button variant="primary" fullWidth onClick={handleSave} className="bg-indigo-600 py-4 font-black tracking-widest"><Check size={18} className="mr-2"/> GUARDAR</Button>
              </div>
            </div>
          </div>
        ) : (
          <Button fullWidth onClick={() => setShowAdd(true)} className="mb-8 py-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-black rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all"><Plus size={20} className="mr-2"/> CREAR CATEGORÍA NUEVA</Button>
        )}

        <div className="space-y-4 mb-10">
          <p className="text-[10px] font-black uppercase text-secondary-400 tracking-[0.2em] ml-2">Mis Categorías ({customCategories.length})</p>
          <div className="grid gap-3">
            {customCategories.map(cat => {
              const IconObj = ICON_LIBRARY.find(i => i.name === cat.iconName);
              const IconComp = IconObj ? IconObj.icon : HelpCircle;
              return (
                <div key={cat.id} className="bg-white dark:bg-secondary-800/50 rounded-[2rem] p-4 border border-secondary-100 dark:border-secondary-800 shadow-sm transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0" style={{ backgroundColor: cat.color }}>
                        <IconComp size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black uppercase tracking-tight truncate">{cat.label}</p>
                        <p className="text-[8px] font-bold text-secondary-400 uppercase tracking-widest">
                          {cat.subcategories?.length || 0} Subcategorías
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(cat)} className="p-2 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl hover:scale-110 transition-transform"><Pencil size={16}/></button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  {cat.subcategories?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {cat.subcategories.map(sub => (
                        <span key={sub.id} className="px-2.5 py-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-[8px] font-black uppercase text-secondary-500">{sub.label}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-secondary-400 tracking-[0.2em] ml-2">Visibilidad de Sistema</p>
          <div className="grid grid-cols-2 gap-3">
            {SYSTEM_CATEGORIES.map(cat => {
              const isHidden = hiddenSystemIds.includes(cat.id);
              return (
                <button 
                  key={cat.id} 
                  onClick={() => toggleHideSystemCategory(cat.id)}
                  className={`flex items-center justify-between p-4 rounded-[1.5rem] border transition-all ${isHidden ? 'opacity-30 grayscale bg-secondary-100 dark:bg-secondary-800 border-transparent' : 'bg-white dark:bg-secondary-900 border-secondary-100 dark:border-secondary-700 shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon size={16} style={{ color: cat.color }} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{cat.label}</span>
                  </div>
                  {isHidden ? <EyeOff size={14}/> : <Eye size={14} className="text-indigo-600"/>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}