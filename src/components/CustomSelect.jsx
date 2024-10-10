import { useState } from 'react';

const CustomSelect = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isOpen, setIsOpen] = useState(false); 
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'tr', label: 'Turkish' },
    { value: 'ar', label: 'Arabic' },
  ];

  // Dropdown menüsünü açma ve kapama işlevi
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="language-selection" className="mt-1 text-center">
      <label htmlFor="target-lang" className="block mb-2 text-[12px] font-bold text-gray-600" style={{letterSpacing:"1px", wordSpacing:"2px"}}>Target Language:</label>
      <div className="relative">
        <button 
          className="border border-gray-300 rounded-md p-1 text-center bg-white text-gray-500 w-[10%] hover:bg-gray-200 text-[14px]" 
          onClick={toggleDropdown} 
          style={{letterSpacing:"1px"}}
        >
          {selectedLanguage}
        </button>
        {isOpen && ( 
          <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 z-10 w-[20%] m-auto max-h-[100px] overflow-y-auto">
            {languages.map(lang => (
              <li 
                key={lang.value} 
                className="p-2 py-3 hover:bg-gray-200 cursor-pointer border-b-[1px] w-[85%] m-auto text-gray-600" 
                onClick={() => {
                  setSelectedLanguage(lang.label); 
                  setIsOpen(false); 
                }}
                style={{letterSpacing:"1px"}}
              >
                {lang.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
