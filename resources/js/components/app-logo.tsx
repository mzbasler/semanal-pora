export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <img src="/images/emblema-logo.svg" alt="Emblema" className="h-10 w-10" />
            <span className="truncate leading-tight font-bold text-sidebar-foreground text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                Semanal do Porã
            </span>
        </div>
    );
}
