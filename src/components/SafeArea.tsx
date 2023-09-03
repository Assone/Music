interface SafeAreaProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  multiple?: number;
}

const SafeArea: React.FC<SafeAreaProps> = ({ position, multiple = 1 }) => (
  <div
    className="w-full"
    style={{
      paddingTop:
        position === 'top'
          ? `calc(env(safe-area-inset-top) * ${multiple})`
          : undefined,
      paddingBottom:
        position === 'bottom'
          ? `calc(env(safe-area-inset-bottom) * ${multiple})`
          : undefined,
      paddingLeft:
        position === 'left'
          ? `calc(env(safe-area-inset-left) * ${multiple})`
          : undefined,
      paddingRight:
        position === 'right'
          ? `calc(env(safe-area-inset-right) * ${multiple})`
          : undefined,
    }}
  />
);

export default SafeArea;
