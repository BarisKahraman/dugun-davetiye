export const designVariants = {
  storybook: "Suluboya hikaye kitabı",
  moonlit: "Gece fenerleri",
  tile: "Akdeniz çini",
  letterpress: "Letterpress davetiye",
  garden: "Zeytin bahçesi"
} as const;

export type DesignVariant = keyof typeof designVariants;

// Site tasarımını değiştirmek için sadece bu değeri değiştirin.
export const activeDesign: DesignVariant = "garden  ";
