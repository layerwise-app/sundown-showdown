import { createFileRoute } from '@tanstack/react-router';

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
  return (
    <main className='fixed inset-0 overflow-hidden bg-[#0b0e1a]'>
      <iframe
        allow='autoplay; fullscreen'
        className='block size-full border-0'
        src='/sundown-showdown.html'
        title='Sundown Showdown'
      />
    </main>
  );
}
