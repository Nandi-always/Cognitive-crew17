declare module '@react-three/fiber' {
  // Minimal declarations used by the project to satisfy TypeScript
  export function useFrame(callback: (state: any, delta: number) => void): void;
  export function useThree(): any;
  export type ThreeEvent<T = Element> = any;
  export const Canvas: any;
  export const extend: any;
}
