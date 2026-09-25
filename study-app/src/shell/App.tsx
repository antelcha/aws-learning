import { useEffect, useState } from 'react';
import { dueConcepts } from '../engine/weakSpots';
import { BossPage } from './BossPage';
import { findLesson, findModule } from './content';
import { HomePage } from './HomePage';
import { LessonPage } from './LessonPage';
import { MistakesPage } from './MistakesPage';
import { ModulePage } from './ModulePage';
import { ProgressPanel } from './ProgressPanel';
import { href, parseHash, type Route } from './router';
import { useProgress, type ProgressApi } from './useProgress';
import { WeakSpotsPage } from './WeakSpotsPage';

function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <a href={href.home()}>Go home</a>
    </section>
  );
}

function Page({ route, api }: { route: Route; api: ProgressApi }) {
  switch (route.page) {
    case 'home':
      return <HomePage api={api} />;
    case 'module': {
      const module = findModule(route.id);
      return module ? <ModulePage module={module} api={api} /> : <NotFound />;
    }
    case 'lesson': {
      const found = findLesson(route.id);
      return found ? <LessonPage key={route.id} module={found.module} lesson={found.lesson} api={api} /> : <NotFound />;
    }
    case 'boss': {
      const module = findModule(route.moduleId);
      return module ? <BossPage key={module.id} module={module} api={api} /> : <NotFound />;
    }
    case 'weak':
      return <WeakSpotsPage api={api} />;
    case 'mistakes':
      return <MistakesPage api={api} />;
    case 'progress':
      return <ProgressPanel api={api} />;
    case 'not-found':
      return <NotFound />;
  }
}

export function App() {
  const route = useRoute();
  const api = useProgress();
  const due = dueConcepts(api.progress.weakSpots, new Date()).length;

  return (
    <>
      <header className="topbar">
        <a href={href.home()} className="brand">
          AWS Study
        </a>
        <nav>
          <a href={href.weak()}>Weak spots{due > 0 && <span className="badge-count">{due}</span>}</a>
          <a href={href.mistakes()}>Mistakes</a>
          <a href={href.progress()}>Progress</a>
          <span className="xp">{api.progress.xp} XP</span>
        </nav>
      </header>
      <main>
        {api.notice && (
          <div className="card notice" role="alert">
            <p>{api.notice}</p>
            <button onClick={api.dismissNotice}>Dismiss</button>
          </div>
        )}
        <Page route={route} api={api} />
      </main>
      <footer className="muted">
        Paraphrased study notes for personal learning. Not affiliated with AWS. Prices are illustrative.
      </footer>
    </>
  );
}
