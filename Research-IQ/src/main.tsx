import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeContextData from './Context/ThemeContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import UploadContext from './Context/UploadContext.tsx'
import { UploadProvider } from './Context/UploadProviderContext.tsx'
import ModeContext from './Context/ModeContext.tsx'
import { OptionsProvider } from './Context/OptionsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeContextData>
      <OptionsProvider>
        <UploadProvider>
          <UploadContext>
            <ModeContext>
              <App />
            </ModeContext>
          </UploadContext>
        </UploadProvider>
      </OptionsProvider>
    </ThemeContextData>
  </BrowserRouter>
  ,
)
