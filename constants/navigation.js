export const MAIN_NAVIGATION = [
  // {
  //   label: 'COVID',
  //   as: '/covid',
  //   href: '/[id]',
  // },
  {
    label: 'About',
    path: '/about',
    list: [
      {
        label: 'What is Quidditch',
        as: '/about/what-is-quidditch',
        href: '/about/[id]',
      },
      {
        label: 'Leadership',
        as: '/about/leadership',
        href: '/about/[id]',
      },
      {
        label: 'Meet the Team',
        as: '/about/meet-the-team',
        href: '/about/[id]',
      },
      {
        label: 'Documents & Policies',
        as: '/about/documents-and-policies',
        href: '/about/[id]',
      },
      {
        label: 'Minutes',
        as: '/about/minutes',
        href: '/about/[id]',
      },
    ],
  },
  {
    label: 'Play',
    path: '/play',
    list: [
      {
        label: 'Find Quidditch',
        as: '/find-quidditch',
        href: '/find-quidditch',
      },
      {
        label: 'Getting Started',
        as: '/play/getting-started',
        href: '/play/[id]',
      },
      {
        label: 'Rulebook',
        as: '/play/rulebook',
        href: '/play/[id]',
      },
      {
        label: 'Official Events',
        as: '/play/official-events',
        href: '/play/[id]',
      },
    ],
  },
  {
    label: 'Volunteer',
    path: '/volunteer',
    list: [
      {
        label: 'Roles',
        as: '/volunteer/roles',
        href: '/volunteer/[id]',
      },
      // {
      //   label: 'Coaches',
      //   as: '/volunteer/coaches',
      //   href: '/volunteer/[id]',
      // },
      {
        label: 'Referees',
        as: '/volunteer/referees',
        href: '/volunteer/[id]',
      },
      {
        label: 'Snitches',
        as: '/volunteer/snitches',
        href: '/volunteer/[id]',
      },
      {
        label: 'Tournaments',
        as: '/volunteer/tournaments',
        href: '/volunteer/[id]',
      },
    ],
  },
  {
    label: 'Youth',
    as: '/youth',
    href: '/[id]',
  },
  {
    label: 'National Teams',
    path: '/programmes/national-teams',
    paths: ['/programmes/team-england', '/programmes/team-wales', '/programmes/team-scotland', '/programmes/national-teams'],
    list: [
      {
        label: 'Team UK',
        as: '/programmes/team-england',
        href: '/programmes/[id]',
      },
      {
        label: 'Team Scotland',
        as: '/programmes/team-scotland',
        href: '/programmes/[id]',
      },
      {
        label: 'Team Wales / Cymru',
        as: '/programmes/team-wales',
        href: '/programmes/[id]',
      },
    ],
  },
  // {
  //   label: 'Merch',
  //   as: '/merch',
  //   href: '/[id]',
  // },
  {
    label: 'News',
    as: '/news',
    href: '/news',
  },
];

export const DASHBOARD_NAVIGATION = [
  {
    label: 'My Membership',
    path: '/dashboard/membership',
    list: [
      {
        label: 'QUK Membership',
        as: '/dashboard/membership/manage',
        href: '/dashboard/membership/[id]',
      },
      {
        label: 'Club',
        as: '/dashboard/membership/club',
        href: '/dashboard/membership/[id]',
      },
      // {
      //   label: 'Transfer',
      //   as: '/dashboard/membership/transfer',
      //   href: '/dashboard/membership/[id]',
      // },
    ],
  },
  // {
  //   label: 'Merch',
  //   as: '/merch',
  //   href: '/merch',
  // },
  {
    label: 'News',
    as: '/news',
    href: '/news',
  },
];
