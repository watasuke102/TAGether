declare module '*.svg' {
  const content: (props: React.SVGProps<SVGElement>) => React.ReactNode;
  export default content;
}
