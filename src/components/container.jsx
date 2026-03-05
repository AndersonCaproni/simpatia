const Container = ({ children, style }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100dvw",
        height: "100dvh",
        boxSizing: "border-box",
        padding: "16px",
        gap: "16px",
        flexDirection: "column",
        background: " var(--gradiente-azul-claro)",
        ...(style || {})
      }}
    >
      {children}
    </div>
  );
};

export default Container;
