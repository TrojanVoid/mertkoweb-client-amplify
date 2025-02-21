import { useState, useEffect, useCallback } from 'react';

const useMenuMobile = () => {
      const [openMenuMobile, setOpenMenuMobile] = useState(false)
  
      const handleMenuMobile = () => {
          setOpenMenuMobile((toggleOpen) => !toggleOpen)
          console.log('Menu Mobile:', openMenuMobile)
      }
  
      const handleClickOutsideMenuMobile = useCallback((event) => {
          const targetElement = event.target;
  
          if (openMenuMobile && !targetElement.closest('#menu-mobile')) {
              setOpenMenuMobile(true)
          }
      }, [openMenuMobile]);
  
      useEffect(() => {
          document.addEventListener('click', handleClickOutsideMenuMobile);
  
          return () => {
              document.removeEventListener('click', handleClickOutsideMenuMobile);
          };
      }, [handleClickOutsideMenuMobile, openMenuMobile])
  
      return {
          openMenuMobile,
          handleMenuMobile,
      }
}

export default useMenuMobile
