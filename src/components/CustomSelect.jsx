import { useState } from 'react';

const CustomSelect = ({selectedLanguage, onLanguageChange}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageClick = (langValue) => {
      onLanguageChange(langValue);
      setIsOpen(false); 
    };
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'tr', label: 'Turkish' },
    { value: 'ar', label: 'Arabic' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'it', label: 'Italian' },
    { value: 'nl', label: 'Dutch' },
    { value: 'sv', label: 'Swedish' },
    { value: 'no', label: 'Norwegian' },
    { value: 'fi', label: 'Finnish' },
    { value: 'da', label: 'Danish' },
    { value: 'he', label: 'Hebrew' },
    { value: 'hi', label: 'Hindi' },
    { value: 'th', label: 'Thai' },
    { value: 'id', label: 'Indonesian' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="language-selection" className="mt-2 text-center">
      <hr className="w-[50%] mx-auto my-2" />
      <label htmlFor="target-lang" className="block mb-2 mt-2 text-[10px] font-bold text-gray-600" style={{letterSpacing:"1px", wordSpacing:"2px"}}>Target Language:</label>
      <div className="relative">
        <button 
          className="border border-gray-300 rounded-md p-1 text-center bg-white text-gray-500 w-[10%] hover:bg-gray-200 text-[14px] mb-20" 
          onClick={toggleDropdown} 
          style={{letterSpacing:"1px"}}
        >
          {selectedLanguage}
        </button>
        {isOpen && ( 
          <ul className=" absolute top-10 left-0 right-0 bg-white border border-gray-300 rounded-md mt-1  w-[20%] m-auto max-h-[100px] overflow-y-auto pb-20 language z-[346455467567657346456546]">
            {languages.map(lang => (
              <li 
                key={lang.value} 
                className="p-2 py-3 hover:bg-gray-200 cursor-pointer border-b-[1px] w-[85%] m-auto text-gray-600" 
                onClick={() => handleLanguageClick(lang.value)} 
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
