declare global {
  interface Window {
    html2pdf: () => {
      set: (options: {
        margin?: number | number[];
        filename?: string;
        image?: { type: string; quality: number };
        html2canvas?: {
          scale: number;
          useCORS: boolean;
          allowTaint?: boolean;
          backgroundColor?: string;
          windowWidth?: number;
          scrollX?: number;
          scrollY?: number;
          ignoreElements?: (element: HTMLElement) => boolean;
        };
        jsPDF?: { unit: string; format: string; orientation: string };
        pagebreak?: { mode?: string[]; before?: string; after?: string; avoid?: string };
      }) => {
        from: (element: HTMLElement) => {
          save: () => Promise<void>;
          toPdf: () => { get: (format: string) => string };
        };
      };
    };
  }
}

export {};