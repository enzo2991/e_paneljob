import React, { createContext, useContext, useState, useEffect } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import NavBar from './navbar';
import { appPages } from '../pages'
import { fetchNui } from '../../utils/fetchNui';

interface PageState {
    name: string
    component: React.FC;
}

interface PageContext {
    openPage: (page:string) => void;
    closeAllPages: () => void;
    userPermissions: string[];
}

const PageContext = createContext<PageContext>({} as PageContext)
export const usePageContext = () => useContext(PageContext)

const ui: React.FC = () => {
    const [pages, setPages] = useState<PageState[]>([])
    const [paragraphs, setParagraphs] = useState<JSX.Element[]>([]);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    function openPage(pageName: string) {
        if(!document.body.classList.contains('show')){
          document.body.classList.add('show')
        }
        type ObjectKey = keyof typeof appPages
        const key = pageName as ObjectKey

        if (!pageName || !appPages[key]) return
        if (pages.find((page) => page.name === pageName)) return

        const newPages = {name: pageName, component:appPages[key].component}
        setPages([newPages])
      }
    
      function closeAllPages() {
        setPages([]);
        setIsVisible(false);
        document.body.style.display = 'none';
        fetchNui("closeUI",{});
      }
    
      function handleMessage(event: { data: any }) {
        const data = event.data
    
        if (data.action == 'openPage') {
          openPage(data.data.pageName)
        } else if (data.action == 'closePage') {
          closeAllPages()
        }
      }
    
      useEffect(() => {
        window.addEventListener('message', handleMessage)
        return () => {
          window.removeEventListener('message', handleMessage)
        }
      }, [])
    
      const pagesMapped = pages
      .filter((page) => {
        const requiredPermissions = appPages[page.name].permissions;
        return requiredPermissions.every((perm) => userPermissions.includes(perm));
      })
      .map((page) => {
        const Page = page.component
        return <Page key={page.name} />
      })
    
      const pagesList: string[] = Object.keys(appPages).filter((pageName) => {
        const requiredPermissions = appPages[pageName].permissions;
        return requiredPermissions.every((perm) => userPermissions.includes(perm));
    });

    useNuiEvent('openUi',(data) =>{
        document.body.style.display = 'flex';
        setIsVisible(true);
        setParagraphs([
            <h6 key="job" className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">{data.job || 'unemployed'}</h6>,
            <h6 key="grade" className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">{data.grade || 'unemployed'}</h6>
        ])
        setUserPermissions(data.permissions || []);
    })

    if (!isVisible) {
      return null;
  }

    return(
      <div className='w-320 h-160 flex flex-row bg-gray-200 rounded-xl gap-2'>
        <PageContext.Provider value={{ openPage, closeAllPages, userPermissions }}>
          <aside className='bg-gradient-to-br from-gray-800 to-gray-900 -translate-x-80  inset-0 z-50 my-4 ml-4  w-72 rounded-xl transition-transform duration-300 xl:translate-x-0'>
            <div className='border-b border-white/20'>
              <div className='flex flex-col items-center gap-4 py-6 px-6'>
                      {paragraphs}
              </div>
            </div>

            <NavBar list={pagesList}/>

            <div className="flex bg-transparent rounded-md p-2  items-center justify-center text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" onClick={closeAllPages}>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </aside>
          {pagesMapped}
        </PageContext.Provider>
      </div>
    )
}

export default ui;