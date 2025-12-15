/**
 * Cores centralizadas do sistema Semanal do Porã
 *
 * TODAS as cores do sistema devem estar aqui.
 * Para alterar qualquer cor, modifique apenas este arquivo.
 */

export const colors = {
    // ========================================
    // CORES DO TEMA BOCA JUNIORS
    // ========================================
    brand: {
        blue: '#0D1B4C',      // Azul principal Boca
        yellow: '#FACC15',    // Amarelo principal Boca
        blueDark: '#1a2d5c',  // Azul escuro (hover/accent)
    },

    // ========================================
    // CORES DOS TIMES
    // ========================================
    teams: {
        azul: '#0045B2',
        branco: '#F5F5F5',
    },

    // ========================================
    // CORES DE AÇÃO (BOTÕES)
    // ========================================
    actions: {
        primary: '#FACC15',           // Botões principais (amarelo)
        primaryText: '#000000',       // Texto em botões primários
        primaryHover: '#EAB308',      // Hover botões primários
        success: '#22C55E',           // Botão + / sucesso (verde)
        successText: '#FFFFFF',
        danger: '#EF4444',            // Botão - / erro (vermelho)
        dangerText: '#FFFFFF',
    },

    // ========================================
    // BACKGROUNDS
    // ========================================
    background: {
        light: '#ffffff',
        dark: '#0a0a0a',
        card: {
            light: '#ffffff',
            dark: '#0D1B4C',
        },
    },

    // ========================================
    // TEXTO
    // ========================================
    text: {
        // Para fundos claros
        onLight: {
            primary: '#000000',
            secondary: '#555555',
            muted: '#64748b',
        },
        // Para fundos escuros
        onDark: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',
            muted: '#a1a1aa',
        },
    },

    // ========================================
    // OVERLAYS (para elementos internos em cards de times)
    // ========================================
    overlay: {
        onLight: 'rgba(0,0,0,0.1)',
        onDark: 'rgba(255,255,255,0.15)',
    },

    // ========================================
    // BORDAS
    // ========================================
    border: {
        onLight: '#cccccc',
        onDark: 'transparent',
    },

    // ========================================
    // CHARTS / GRÁFICOS
    // ========================================
    chart: {
        yellow: '#FACC15',
        blue: '#0D1B4C',
        green: '#22c55e',
        orange: '#f97316',
        pink: '#ec4899',
    },

    // ========================================
    // UI / INTERFACE
    // ========================================
    ui: {
        progressBar: '#FACC15',  // Barra de progresso do Inertia
    },
} as const;

/**
 * Utilitário para determinar se uma cor é clara
 */
export function isLightColor(color: string): boolean {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180;
}

/**
 * Retorna as cores apropriadas baseado na cor de fundo
 */
export function getColorsForBackground(bgColor: string) {
    const isLight = isLightColor(bgColor);
    return {
        text: isLight ? colors.text.onLight.primary : colors.text.onDark.primary,
        textMuted: isLight ? colors.text.onLight.secondary : colors.text.onDark.secondary,
        overlay: isLight ? colors.overlay.onLight : colors.overlay.onDark,
        border: isLight ? colors.border.onLight : colors.border.onDark,
        avatarBg: isLight ? '333333' : 'ffffff',
        avatarText: isLight ? 'ffffff' : '333333',
    };
}

/**
 * Retorna a cor do time pelo nome
 */
export function getTeamColor(teamName: string): string {
    if (teamName === 'Time Azul') return colors.teams.azul;
    if (teamName === 'Time Branco') return colors.teams.branco;
    return '#888888';
}
