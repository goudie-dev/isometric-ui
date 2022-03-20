import React, { useState } from 'react';

import AppBarWithAppHeaderLayout from '../../components/AppBarWithAppHeaderLayout/AppBarWithAppHeaderLayout';
import BottomSheet from '../../components/BottomSheet/BottomSheet';
import ConfirmationBottomSheet from '../../components/ConfirmationBottomSheet/ConfirmationBottomSheet';
import styles from './index.module.scss';

export default function WorkoutPlan() {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [confirm, setConfirm] = useState(false);
    return (
        <AppBarWithAppHeaderLayout pageTitle='Workout Plan'>
            <h1>Workout Plan</h1>
            <div className={styles.root}>
                <div>
                    <button type='button' onClick={() => setOpen(true)}>
                        open
                    </button>
                </div>
                <div>
                    <button type='button' onClick={() => setOpen2(true)}>
                        open2
                    </button>
                </div>
                <div>
                    <button type='button' onClick={() => setConfirm(true)}>
                        confirm
                    </button>
                </div>
                {open && (
                    <BottomSheet
                        title='Hello'
                        locked
                        onResult={() => {
                            setOpen(false);
                        }}
                    >
                        {(onResult) => (
                            <div>
                                <button
                                    className='standard-button'
                                    onClick={onResult}
                                >
                                    Click to close!
                                </button>
                            </div>
                        )}
                    </BottomSheet>
                )}
                {open2 && (
                    <BottomSheet
                        title='Select an Exercise'
                        onResult={() => {
                            setOpen2(false);
                        }}
                    >
                        {(onResult) => (
                            <div>
                                Quisque non tellus orci ac auctor augue. Blandit
                                cursus risus at ultrices mi. Eu consequat ac
                                felis donec et odio pellentesque. Viverra mauris
                                in aliquam sem fringilla ut morbi tincidunt.
                                Nisi scelerisque eu ultrices vitae auctor eu.
                                Augue neque gravida in fermentum et sollicitudin
                                ac. Interdum varius sit amet mattis vulputate
                                enim. Vel turpis nunc eget lorem dolor sed
                                viverra ipsum. Amet consectetur adipiscing elit
                                duis. Aenean sed adipiscing diam donec
                                adipiscing tristique risus nec feugiat. Quis
                                viverra nibh cras pulvinar mattis nunc sed odio
                                euismod lacinia at quis risus. Lacus sed turpis
                                tincidunt id aliquet risus feugiat in. Sed
                                libero enim sed faucibus turpis. Tellus rutrum
                                tellus pellentesque eu. Vestibulum rhoncus est
                                pellentesque elit ullamcorper dignissim cras
                                tincidunt lobortis.
                            </div>
                        )}
                    </BottomSheet>
                )}
                {confirm && (
                    <ConfirmationBottomSheet
                        prompt="Are you sure that you'd like to perform this action?"
                        onResult={(yesOrNo) => {
                            setConfirm(false);
                            console.log('yesOrNo', yesOrNo);
                        }}
                    />
                )}
            </div>
        </AppBarWithAppHeaderLayout>
    );
}
