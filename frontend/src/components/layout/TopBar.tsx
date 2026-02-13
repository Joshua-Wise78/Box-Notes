interface TopBarProps {
  toggleSidebar: () => void;
}

export default function TopBar({ toggleSidebar }: TopBarProps) {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center justify-between gap-2">
        <button onClick={toggleSidebar}>=</button>
        <span className="font-bold">
          Box-Notes
        </span>
      </div>
    </div>
  );
}
