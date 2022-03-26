import './App.scss';

import { Navigate, Route, Routes } from 'react-router-dom';
import React, { FC, Suspense } from 'react';

import RouteLoader from './components/RouteLoader/RouteLoader';
import ServiceWorkerUpdater from './components/ServiceWorkerUpdater/ServiceWorkerUpdater';

const Settings = React.lazy(() => import('./pages/settings'));
const WorkoutPlan = React.lazy(() => import('./pages/workout-plan'));
const History = React.lazy(() => import('./pages/history'));
const Home = React.lazy(() => import('./pages/home'));
const Exercises = React.lazy(() => import('./pages/exercises'));
const Exercise = React.lazy(() => import('./pages/exercise'));

const App: FC = () => (
    <>
        <Routes>
            <Route
                path='home'
                element={
                    <Suspense fallback={<RouteLoader />}>
                        <Home />
                    </Suspense>
                }
            />
            <Route
                path='exercises'
                element={
                    <Suspense fallback={<RouteLoader />}>
                        <Exercises />
                    </Suspense>
                }
            />
            <Route
                path='exercises/:exerciseName'
                element={
                    <Suspense fallback={<RouteLoader />}>
                        <Exercise />
                    </Suspense>
                }
            />
            <Route
                path='history'
                element={
                    <Suspense fallback={<RouteLoader />}>
                        <History />
                    </Suspense>
                }
            />
            <Route
                path='settings'
                element={
                    <Suspense fallback={<RouteLoader />}>
                        <Settings />
                    </Suspense>
                }
            />
            <Route
                path='workout-plan'
                element={
                    <Suspense fallback={<RouteLoader />}>
                        <WorkoutPlan />
                    </Suspense>
                }
            />
            <Route path='*' element={<Navigate replace to='/home' />} />
        </Routes>
        <ServiceWorkerUpdater />
    </>
);

export default App;
