import React from 'react';

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const AgentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="14" height="18" x="5" y="2" rx="2" ry="2"></rect>
        <path d="M12 18h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 6h.01"></path>
    </svg>
);

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m22 2-7 20-4-9-9-4Z"></path>
    <path d="M22 2 11 13"></path>
  </svg>
);

export const BCLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="153" height="44" viewBox="0 0 153 44" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M111.427 22.1465C111.427 34.12 101.547 44 89.5732 44C77.5997 44 67.7197 34.12 67.7197 22.1465C67.7197 10.173 77.5997 0.292969 89.5732 0.292969C101.547 0.292969 111.427 10.173 111.427 22.1465Z" fill="#FCBA19"/>
        <path d="M89.5735 44C79.1335 44 70.4735 37.18 68.2735 27.9H110.874C108.674 37.18 100.014 44 89.5735 44Z" fill="#E3A82B"/>
        <path d="M89.5732 0.292969C100.013 0.292969 108.673 7.11297 110.873 16.393H68.2732C70.4732 7.11297 79.1332 0.292969 89.5732 0.292969Z" fill="#FDD14E"/>
        <path d="M67.7197 22.1465C67.7197 32.5865 75.9397 41.2465 85.2197 43.4465V0.846484C75.9397 3.04648 67.7197 11.7065 67.7197 22.1465Z" fill="#E3A82B"/>
        <path d="M111.427 22.1465C111.427 11.7065 103.207 3.04648 93.9268 0.846484V43.4465C103.207 41.2465 111.427 32.5865 111.427 22.1465Z" fill="#FDD14E"/>
        <path d="M96.791 22.1465C96.791 26.1365 93.581 29.3465 89.591 29.3465C85.601 29.3465 82.391 26.1365 82.391 22.1465C82.391 18.1565 85.601 14.9465 89.591 14.9465C93.581 14.9465 96.791 18.1565 96.791 22.1465Z" fill="#003366"/>
        <path d="M89.591 29.3464C86.381 29.3464 83.771 26.9164 82.751 23.9064H96.431C95.411 26.9164 92.801 29.3464 89.591 29.3464Z" fill="#2E557C"/>
        <path d="M89.591 14.9465C92.801 14.9465 95.411 17.3765 96.431 20.3865H82.751C83.771 17.3765 86.381 14.9465 89.591 14.9465Z" fill="#527BAC"/>
        <path d="M82.391 22.1465C82.391 25.3565 84.821 27.9665 87.831 28.9865V15.3065C84.821 16.3265 82.391 18.9365 82.391 22.1465Z" fill="#2E557C"/>
        <path d="M96.791 22.1465C96.791 18.9365 94.361 16.3265 91.351 15.3065V28.9865C94.361 27.9665 96.791 25.3565 96.791 22.1465Z" fill="#527BAC"/>
        <g>
            <path d="M6.082 17.1521V12.3521H0.242V9.6921H6.082V4.9321H8.862V9.6921H14.162V12.3521H8.862V17.1521C8.862 18.2521 9.242 18.8121 10.002 18.8121C10.322 18.8121 10.642 18.7521 10.962 18.6321L11.522 21.0321C10.822 21.2921 10.022 21.4321 9.122 21.4321C7.042 21.4321 6.082 20.2521 6.082 18.1921V17.1521Z" fill="#003366"/>
            <path d="M16.4819 21.1921V5.0121H24.3819C27.0219 5.0121 28.7819 5.8921 29.6619 7.6521C30.5419 9.3921 30.5619 11.2321 29.7219 12.8721C28.8819 14.5121 27.1819 15.3721 24.6219 15.3721H19.2619V21.1921H16.4819ZM24.2019 7.6721H19.2619V12.7121H24.2019C26.1619 12.7121 26.9619 11.8321 26.9619 10.1921C26.9619 8.5521 26.1619 7.6721 24.2019 7.6721Z" fill="#003366"/>
            <path d="M32.5322 21.1921V5.0121H43.1922V7.6721H35.3122V11.7521H42.1722V14.4121H35.3122V18.5321H43.4322V21.1921H32.5322Z" fill="#003366"/>
            <path d="M45.541 21.1921V5.0121H48.321V21.1921H45.541Z" fill="#003366"/>
            <path d="M50.4871 21.1921V5.0121H58.3871C61.0271 5.0121 62.7871 5.8921 63.6671 7.6521C64.5471 9.3921 64.5671 11.2321 63.7271 12.8721C62.8871 14.5121 61.1871 15.3721 58.6271 15.3721H53.2671V21.1921H50.4871ZM58.2071 7.6721H53.2671V12.7121H58.2071C60.1671 12.7121 60.9671 11.8321 60.9671 10.1921C60.9671 8.5521 60.1671 7.6721 58.2071 7.6721Z" fill="#003366"/>
            <path d="M120.352 17.1521V12.3521H114.512V9.6921H120.352V4.9321H123.132V9.6921H128.432V12.3521H123.132V17.1521C123.132 18.2521 123.512 18.8121 124.272 18.8121C124.592 18.8121 124.912 18.7521 125.232 18.6321L125.792 21.0321C125.092 21.2921 124.292 21.4321 123.392 21.4321C121.312 21.4321 120.352 20.2521 120.352 18.1921V17.1521Z" fill="#003366"/>
            <path d="M130.552 21.1921V5.0121H133.332V21.1921H130.552Z" fill="#003366"/>
            <path d="M136.007 21.1921V5.0121H143.907C146.547 5.0121 148.307 5.8921 149.187 7.6521C150.067 9.3921 150.087 11.2321 149.247 12.8721C148.407 14.5121 146.707 15.3721 144.147 15.3721H138.787V21.1921H136.007ZM143.727 7.6721H138.787V12.7121H143.727C145.687 12.7121 146.487 11.8321 146.487 10.1921C146.487 8.5521 145.687 7.6721 143.727 7.6721Z" fill="#003366"/>
        </g>
    </svg>
);


export const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
);

export const RefreshCwIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
        <path d="M21 3v5h-5"></path>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
        <path d="M3 21v-5h5"></path>
    </svg>
);

export const MessageSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const PaperclipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);