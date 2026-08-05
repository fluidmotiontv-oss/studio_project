export interface Dragon9TimeState { cycleHour: number; cycleMinute: number; apexActive: boolean; apexAngle: number; season: Season; language: Language; }
export type Season = 'summer'|'autumn'|'winter'|'spring'; export type Language = 'en'|'ja';
export interface Product { id: string; name: string; nameJa: string; price: number; category: 'scoop'|'pint'|'sundae'|'seasonal'; available: boolean; imageUrl?: string; description: string; }
export interface InstagramPost { id: string; caption: string; imageUrl: string; permalink: string; timestamp: string; scrapedAt: string; }
export interface OrderItem { productId: string; quantity: number; notes: string; }
export interface KioskOrder { items: OrderItem[]; total: number; customerName: string; pickupTime: string; language: Language; }