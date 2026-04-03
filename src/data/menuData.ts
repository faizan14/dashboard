/**
 * Centralized navigation menu structure.
 *
 * Currently hardcoded — will be replaced with a fetch API call later.
 * To switch to dynamic data, replace `getMenuData()` with an async
 * function that calls the backend and returns the same shape.
 */

export interface MenuItem {
  id: string;
  label: string;
  badge?: string;
  route?: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  section?: string;
  accent?: boolean;
  items: MenuItem[];
}

export interface MenuData {
  groups: MenuGroup[];
}

const MENU_DATA: MenuData = {
  groups: [
    {
      id: 'grp-inbound',
      label: 'Inbound Flow',
      items: [
        { id: 'entrata', label: 'Entrata Merci' },
        { id: 'ordini-acquisto', label: 'Ordini di Acquisto' },
      ],
    },
    {
      id: 'grp-outbound',
      label: 'Outbound Flow',
      items: [
        { id: 'baie', label: 'Baie' },
        { id: 'composizione-uscite', label: 'Composizione Uscite Merci' },
        { id: 'ordini-vendita', label: 'Ordini Di Vendita' },
        { id: 'pianificazione-spedizioni', label: 'Pianificazione Spedizioni' },
        { id: 'stato-picking', label: 'Stato Picking' },
        { id: 'stato-prenotazione', label: 'Stato Prenotazione Giacenza' },
        { id: 'stato-preparazione', label: 'Stato Preparazione Spedizioni' },
        { id: 'uscita-merci', label: 'Uscita Merci' },
        { id: 'viaggi', label: 'Viaggi' },
      ],
    },
    {
      id: 'grp-warehouse',
      label: 'Warehouse Flow',
      items: [
        { id: 'analisi-magazzino', label: 'Analisi Magazzino' },
        { id: 'dettaglio-udc', label: 'Dettaglio UdC' },
        { id: 'gestione-udc', label: 'Gestione UDC' },
        { id: 'giacenza-area', label: 'Giacenza per Area' },
        { id: 'giacenza-caratteristiche', label: 'Giacenza per Caratteristiche' },
        { id: 'giacenza-locazione', label: 'Giacenza per Locazione' },
        { id: 'log-logistici', label: 'Log Logistici' },
        { id: 'log-qualitativi', label: 'Log Qualitativi' },
        { id: 'log-stampe', label: 'Log Stampe' },
        { id: 'missioni-corso', label: 'Missioni in Corso' },
        { id: 'simulatore-hh', label: 'Simulatore HH' },
        { id: 'stampa-etichette', label: 'Stampa etichette fisiche' },
        { id: 'stampa-udc-vuote', label: 'Stampa UDC vuote' },
        { id: 'trasferimenti-corso', label: 'Trasferimenti in Corso' },
      ],
    },
    {
      id: 'grp-mdm',
      label: 'Global Master Data Management',
      section: 'MDM',
      accent: true,
      items: [
        { id: 'articoli', label: 'Articoli', badge: '15.340' },
        { id: 'soggetti', label: 'Soggetti', badge: '3.903' },
        { id: 'aree-magazzino', label: 'Aree magazzino' },
        { id: 'unita-misura', label: 'Unità di misura' },
        { id: 'tipi-prodotto', label: 'Tipi Prodotto' },
        { id: 'tipi-movimento', label: 'Tipi Movimento', badge: '154' },
        { id: 'configurazioni-wms', label: 'Configurazioni WMS' },
        { id: 'integrazioni-erp', label: 'Integrazioni ERP' },
      ],
    },
    {
      id: 'grp-admin',
      label: 'Amministrazione',
      items: [
        { id: 'user-auth', label: 'User Authorization', badge: '108', route: '/profile' },
        { id: 'report', label: 'Report' },
        { id: 'audit-trail', label: 'Audit Trail' },
      ],
    },
  ],
};

/** Returns the hardcoded menu. Replace with an async fetch later. */
export function getMenuData(): MenuData {
  return MENU_DATA;
}
