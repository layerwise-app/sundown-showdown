import { createFileRoute } from '@tanstack/react-router';
import { SundownShowdown } from '~/game/SundownShowdown';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Sundown Showdown' },
      {
        name: 'description',
        content:
          'A last-brawler-standing arena shooter where sunset brings the poison gas.'
      }
    ]
  }),
  component: Home
});

function Home() {
  return <SundownShowdown />;
}
