import React, { useEffect } from 'react';

import Loader from '../Loader/Loader';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './AppBarLayout.module.scss';

type Props = {
    header?: React.ReactNode;
    pageTitle: string;
    showLoading: boolean;
};

export default function AppBarLayout({
    children,
    header,
    pageTitle,
    showLoading,
}: React.PropsWithChildren<Props>) {
    useEffect(() => {
        document.title = `${pageTitle} | ISOMETRIC`;
    }, [pageTitle]);
    let body = <div className={styles.body}>{children}</div>;
    if (showLoading) {
        body = (
            <div className={styles.bodyLoading}>
                <Loader />
            </div>
        );
    }
    return (
        <div className={styles.root}>
            {header}
            {body}
            <div className={styles.bottomBar}>
                <div className={styles.bottomBarInner}>
                    <AppBarButton
                        href='/home'
                        text='Home'
                        iconClass='fa-house'
                    />
                    <AppBarButton
                        href='/exercises'
                        text='Exercises'
                        iconClass='fa-dumbbell'
                    />
                    <AppBarButton
                        href='/history'
                        text='History'
                        iconClass='fa-list-check'
                    />
                </div>
            </div>
        </div>
    );
}

type AppBarButtonProps = {
    href: string;
    text: string;
    iconClass: string;
};

function AppBarButton({ href, text, iconClass }: AppBarButtonProps) {
    return (
        <NavLink
            to={href}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
            <i className={classNames('fa-solid', iconClass)}></i>
            {text}
        </NavLink>
    );
}
