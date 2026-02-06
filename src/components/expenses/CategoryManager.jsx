import React, { useState, useMemo } from "react";
import { useCategoryStore } from "../../stores/categoryStore";
import { useAuthStore } from "../../stores/authStore";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { 
  X, Plus, Trash2, EyeOff, Eye, Pencil, Check, Search, CornerDownRight,
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

// ✅ LISTA MAESTRA DE ICONOS (Exportada para que otros componentes sepan qué iconos existen)
export const ICON_LIBRARY = [
  { name: "Utensils", icon: Utensils, tags: "comida" }, { name: "Pizza", icon: Pizza, tags: "cena" },
  { name: "Coffee", icon: Coffee, tags: "cafe" }, { name: "Beer", icon: Beer, tags: "fiesta" },
  { name: "Car", icon: Car, tags: "auto" }, { name: "Truck", icon: Truck, tags: "envio" },
  { name: "Home", icon: Home, tags: "casa" }, { name: "TreePine", icon: TreePine, tags: "jardin" },
  { name: "Film", icon: Film, tags: "cine" }, { name: "Gamepad2", icon: Gamepad2, tags: "juegos" },
  { name: "Music", icon: Music, tags: "spotify" }, { name: "Pill", icon: Pill, tags: "salud" },
  { name: "Heart", icon: Heart, tags: "vida" }, { name: "Dumbbell", icon: Dumbbell, tags: "gym" },
  { name: "Book", icon: Book, tags: "escuela" }, { name: "GraduationCap", icon: GraduationCap, tags: "titulo" },
  { name: "Shirt", icon: Shirt, tags: "ropa" }, { name: "ShoppingBag", icon: ShoppingBag, tags: "compras" },
  { name: "ShoppingCart", icon: ShoppingCart, tags: "super" }, { name: "Plane", icon: Plane, tags: "viaje" },
  { name: "Gift", icon: Gift, tags: "regalo" }, { name: "Camera", icon: Camera, tags: "fotos" },
  { name: "Wrench", icon: Wrench, tags: "taller" }, { name: "Factory", icon: Factory, tags: "trabajo" },
  { name: "Construction", icon: Construction, tags: "obra" }, { name: "Star", icon: Star, tags: "especial" },
  { name: "Zap", icon: Zap, tags: "luz" }, { name: "Smartphone", icon: Smartphone, tags: "celular" },
  { name: "Laptop", icon: Laptop, tags: "pc" }, { name: "Monitor", icon: Monitor, tags: "tv" },
  { name: "Baby", icon: Baby, tags: "bebe" }, { name: "Dog", icon: Dog, tags: "perro" },
  { name: "Cat", icon: Cat, tags: "gato" }, { name: "Umbrella", icon: Umbrella, tags: "seguro" },
  { name: "ShieldCheck", icon: ShieldCheck, tags: "seguridad" }, { name: "Briefcase", icon: Briefcase, tags: "oficina" },
  { name: "CreditCard", icon: CreditCard, tags: "tarjeta" }, { name: "Banknote", icon: Banknote, tags: "efectivo" },
  { name: "Wallet", icon: Wallet, tags: "cartera" }, { name: "Landmark", icon: Landmark, tags: "banco" },
  { name: "Receipt", icon: Receipt, tags: "factura" }, { name: "TrendingUp", icon: TrendingUp, tags: "inversion" },
  { name: "PiggyBank", icon: PiggyBank, tags: "ahorro" }, { name: "HelpCircle", icon: HelpCircle, tags: "otros" }
];

const COLORS = ['#FFD700', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#6366f1', '#1e1b4b'];

const CategoryManager = ({ onClose }) => {
  const { user } = useAuthStore();
  const { customCategories, addCategory, updateCategory, deleteCategory, toggleHideSystemCategory, hiddenSystemIds } = useCategoryStore();
  
  const [editingId, setEditingId] = useState(null);
  const [catName, setCatName] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('Star');
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcatName, setNewSubcatName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setCatName(cat.label);
    setSelectedIconName(cat.iconName || 'Star');
    setSelectedColor(cat.color || '#FFD700');
    setSubcategories(cat.subcategories || []);
    document.querySelector('.form-target')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setCatName('');
    setSelectedIconName('Star');
    setSelectedColor('#FFD700');
    setSubcategories([]);
    setNewSubcatName('');
  };

  const handleAddSubcat = () => {
    if (!newSubcatName.trim()) return;
    setSubcategories([...subcategories, { id: Date.now().toString(), label: newSubcatName.trim() }]);
    setNewSubcatName('');
  };

  const handleSubmit = async () => {
    if (!catName.trim()) return;
    
    const categoryData = {
      label: catName,
      iconName: selectedIconName,
      color: selectedColor,
      subcategories: subcategories,
      type: 'expense'
    };

    if (editingId) {
      await updateCategory(editingId, categoryData);
    } else {
      // ✅ CORREGIDO: Llamamos solo con categoryData (el store pone el userId)
      await addCategory(categoryData);
    }
    
    resetForm();
  };

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return ICON_LIBRARY;
    return ICON_LIBRARY.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.tags.includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const SelectedIconComp = ICON_LIBRARY.find(i => i.name === selectedIconName)?.icon || Star;

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans">
      <div className="w-full sm:max-w-2xl bg-white dark:bg-secondary-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        <div className="p-6 border-b border-secondary-100 dark:border-secondary-800 flex justify-between items-center bg-white dark:bg-secondary-900 shrink-0 form-target">
          <h2 className="text-sm font-black uppercase text-[#FFD700] tracking-widest">{editingId ? 'Editar' : 'Gestionar'} Categorías</h2>
          <button onClick={onClose}><X size={20} className="text-secondary-500" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* FORMULARIO */}
          <div className={`space-y-4 p-5 rounded-[2rem] border transition-all ${editingId ? 'bg-[#FFD700]/5 border-[#FFD700]/30' : 'bg-secondary-50/50 dark:bg-secondary-800/30 border-secondary-100 dark:border-secondary-700'}`}>
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#1e1b4b] shadow-lg shrink-0 transition-colors" style={{ backgroundColor: selectedColor }}>
                <SelectedIconComp size={24} />
              </div>
              <input type="text" placeholder="Nombre..." className="flex-1 bg-transparent font-black text-lg outline-none text-secondary-900 dark:text-white" value={catName} onChange={(e) => setCatName(e.target.value)} />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {COLORS.map(color => (
                <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedColor === color ? 'border-secondary-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: color }}>
                  {selectedColor === color && <Check size={14} className="text-white mix-blend-difference" />}
                </button>
              ))}
            </div>

            {/* SUBCATEGORÍAS */}
            <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-3 border border-secondary-100 dark:border-secondary-700">
              <div className="flex items-center gap-2 mb-2">
                <CornerDownRight size={16} className="text-secondary-400" />
                <input type="text" placeholder="Añadir subcategoría (Enter)..." className="bg-transparent text-xs font-bold w-full outline-none text-secondary-900 dark:text-white" value={newSubcatName} onChange={(e) => setNewSubcatName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSubcat()} />
                <button onClick={handleAddSubcat} className="p-1 bg-secondary-200 dark:bg-secondary-700 rounded-lg hover:bg-[#FFD700] hover:text-[#1e1b4b]"><Plus size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subcategories.map(sub => (
                  <span key={sub.id} className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-secondary-800 rounded-lg text-[10px] font-bold border border-secondary-200 dark:border-secondary-700">
                    {sub.label}
                    <button onClick={() => setSubcategories(subcategories.filter(s => s.id !== sub.id))} className="hover:text-red-500"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* BUSCADOR ICONOS */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={14} />
              <input type="text" placeholder="Buscar icono..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-secondary-900 border border-secondary-200 text-xs font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 h-32 overflow-y-auto custom-scrollbar p-1">
              {filteredIcons.map(({ name, icon: Icon }) => (
                <button key={name} onClick={() => setSelectedIconName(name)} className={`p-2 rounded-xl flex items-center justify-center transition-all ${selectedIconName === name ? 'bg-[#FFD700] text-[#1e1b4b] shadow-md scale-105' : 'hover:bg-white dark:hover:bg-secondary-800 text-secondary-400'}`}>
                  <Icon size={20} />
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {editingId && <Button variant="secondary" className="flex-1 py-4" onClick={resetForm}>Cancelar</Button>}
              <Button fullWidth={!editingId} className={`py-4 shadow-xl ${editingId ? 'flex-[2]' : 'w-full'}`} onClick={handleSubmit} disabled={!catName.trim()} variant="primary">
                {editingId ? <><Check size={18} /> Actualizar</> : <><Plus size={18} /> Crear</>}
              </Button>
            </div>
          </div>

          {/* LISTA PERSONALIZADAS */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-secondary-400 tracking-[0.2em] ml-2">Mis Categorías</p>
            {customCategories.length === 0 ? <div className="text-center py-4 opacity-40 text-xs font-bold">Sin categorías creadas</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customCategories.map(cat => {
                  const IconComp = ICON_LIBRARY.find(i => i.name === cat.iconName)?.icon || HelpCircle;
                  const isEditingThis = editingId === cat.id;
                  return (
                    <div key={cat.id} className={`relative overflow-hidden flex items-center justify-between p-3 rounded-2xl border transition-all ${isEditingThis ? 'border-[#FFD700] bg-[#FFD700]/5 ring-1 ring-[#FFD700]' : 'bg-white dark:bg-secondary-900 border-secondary-100 dark:border-secondary-700 shadow-sm'}`}>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1e1b4b] shadow-sm shrink-0" style={{ backgroundColor: cat.color }}><IconComp size={18} /></div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm text-secondary-900 dark:text-white capitalize truncate">{cat.label}</span>
                          {cat.subcategories?.length > 0 && <span className="text-[9px] text-secondary-400 truncate flex items-center gap-1"><CornerDownRight size={10} /> {cat.subcategories.length} subcategorías</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(cat)} className="p-2 text-secondary-400 hover:text-[#1e1b4b] hover:bg-[#FFD700] rounded-xl transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => deleteCategory(cat.id)} className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LISTA SISTEMA */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-secondary-400 tracking-[0.2em] ml-2">Visibilidad de Sistema</p>
            <div className="grid grid-cols-2 gap-3">
              {SYSTEM_CATEGORIES.map(cat => {
                const isHidden = hiddenSystemIds.includes(cat.id);
                return (
                  <button key={cat.id} onClick={() => toggleHideSystemCategory(cat.id)} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isHidden ? 'opacity-40 grayscale bg-secondary-50 dark:bg-secondary-800 border-transparent' : 'bg-white dark:bg-secondary-900 border-secondary-100 dark:border-secondary-700 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: isHidden ? 'transparent' : `${cat.color}20` }}><cat.icon size={16} style={{ color: isHidden ? 'gray' : cat.color }} /></div>
                      <span className="text-[10px] font-black uppercase tracking-tighter">{cat.label}</span>
                    </div>
                    {isHidden ? <EyeOff size={14} className="text-secondary-400"/> : <Eye size={14} className="text-[#FFD700]"/>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;