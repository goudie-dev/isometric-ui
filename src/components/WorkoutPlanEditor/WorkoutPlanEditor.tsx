import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from 'react-beautiful-dnd';
import { IExercise, IWorkoutScheduleDay } from '@dgoudie/isometric-types';
import React, { useCallback, useMemo, useState } from 'react';
import {
    deleteItemFromArray,
    moveItemInArray,
    replaceItemInArray,
} from '../../utils/array-helpers';

import ExercisePickerBottomSheet from '../ExercisePickerBottomSheet/ExercisePickerBottomSheet';
import MuscleGroupTag from '../MuscleGroupTag/MuscleGroupTag';
import styles from './WorkoutPlanEditor.module.scss';
import { v4 as uuidV4 } from 'uuid';

interface Props {
    days: IWorkoutScheduleDay[];
    daysChanged: (days: IWorkoutScheduleDay[]) => void;
    exerciseMap: Map<string, IExercise>;
}

export default function WorkoutPlanEditor({
    days: daysWithoutId,
    exerciseMap,
    daysChanged,
}: Props) {
    const days = useMemo(
        () => daysWithoutId.map((day) => ({ ...day, id: uuidV4() })),
        [daysWithoutId]
    );

    const onDragEnd = useCallback(
        ({ source, destination }: DropResult) => {
            if (!destination) {
                return;
            }
            if (destination.index === source.index) {
                return;
            }
            daysChanged(moveItemInArray(days, source.index, destination.index));
        },
        [days, daysChanged]
    );

    const handleAdd = useCallback(
        () => daysChanged([...days, { exercises: [], id: uuidV4() }]),
        [days, daysChanged]
    );

    const handleDelete = useCallback(
        (index: number) => {
            daysChanged(deleteItemFromArray(days, index));
        },
        [days, daysChanged]
    );

    const exercisesChanged = useCallback(
        (exercises: string[], index: number) => {
            const day = days[index];
            daysChanged(replaceItemInArray(days, index, { ...day, exercises }));
        },
        [days, daysChanged]
    );

    if (!days.length) {
        return (
            <div className={styles.noDays}>
                <span>
                    Here, you can build a workout schedule. Start by adding a
                    day, and adding some exercises.
                </span>
                <button
                    className={'standard-button primary'}
                    onClick={handleAdd}
                >
                    <i className='fa-solid fa-plus'></i>
                    Add Day
                </button>
            </div>
        );
    }

    return (
        <div className={styles.list}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='workout_plan_days'>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {days.map(({ id, exercises }, index) => (
                                <Day
                                    key={id}
                                    id={id}
                                    exercises={exercises}
                                    exercisesChanged={(exercises) =>
                                        exercisesChanged(exercises, index)
                                    }
                                    index={index}
                                    exerciseMap={exerciseMap}
                                    onDelete={() => handleDelete(index)}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className={styles.addDay}>
                <button className={'standard-button'} onClick={handleAdd}>
                    <i className='fa-solid fa-copy'></i>
                    Copy Day
                </button>
                <button
                    className={'standard-button primary'}
                    onClick={handleAdd}
                >
                    <i className='fa-solid fa-plus'></i>
                    Add Day
                </button>
            </div>
        </div>
    );
}

interface DayProps {
    id: string;
    exercises: string[];
    exercisesChanged: (exercises: string[]) => void;
    index: number;
    exerciseMap: Map<string, IExercise>;
    onDelete: () => void;
}

function Day({
    id: dayId,
    exercises,
    exercisesChanged,
    index,
    exerciseMap,
    onDelete,
}: DayProps) {
    const [exercisePickerVisible, setExercisePickerVisible] = useState(false);

    const onExercisePickerResult = useCallback(
        (result: string | undefined) => {
            setExercisePickerVisible(false);
            if (!!result) {
                exercisesChanged([...exercises, result]);
            }
        },
        [exercises, exercisesChanged]
    );

    const deleteDayWrapped = useCallback(
        (event) => {
            event.stopPropagation();
            onDelete();
        },
        [onDelete]
    );

    const onDragEnd = useCallback(
        ({ source, destination }: DropResult) => {
            if (!destination) {
                return;
            }
            if (destination.index === source.index) {
                return;
            }
            exercisesChanged(
                moveItemInArray(exercises, source.index, destination.index)
            );
        },
        [exercises, exercisesChanged]
    );

    const handleExerciseDelete = useCallback(
        (index: number) => {
            exercisesChanged(deleteItemFromArray(exercises, index));
        },
        [exercises, exercisesChanged]
    );

    return (
        <Draggable draggableId={dayId} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    className={styles.day}
                    {...provided.draggableProps}
                >
                    <div className={styles.dayHeader}>
                        <div
                            className={styles.dayHandle}
                            {...provided.dragHandleProps}
                        >
                            <i className='fa-solid fa-grip-lines'></i>
                        </div>
                        <div className={styles.dayNumber}>Day {index + 1}</div>
                        <button
                            type='button'
                            onClick={deleteDayWrapped}
                            className={styles.deleteIcon}
                        >
                            <i className='fa-solid fa-trash'></i>
                        </button>
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={dayId}>
                            {(provided) => (
                                <div
                                    className={styles.exercises}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {exercises.map((exerciseId, index) => (
                                        <Exercise
                                            index={index}
                                            key={`${dayId}_${exerciseId}_${index}`}
                                            dayId={dayId}
                                            exerciseId={exerciseId}
                                            exerciseMap={exerciseMap}
                                            onDelete={() =>
                                                handleExerciseDelete(index)
                                            }
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    {exercises.length === 0 && (
                        <div className={styles.noExercises}>
                            Please add at least one exercise.
                        </div>
                    )}
                    <button
                        className={styles.addExercise}
                        onClick={() => setExercisePickerVisible(true)}
                    >
                        <div className={styles.exerciseHandle}>
                            <i className='fa-solid fa-plus'></i>
                        </div>
                        <div className={styles.exerciseName}>Add Exercise</div>
                    </button>
                    {exercisePickerVisible && (
                        <ExercisePickerBottomSheet
                            onResult={onExercisePickerResult}
                        />
                    )}
                </div>
            )}
        </Draggable>
    );
}

interface ExerciseProps {
    index: number;
    dayId: string;
    exerciseId: string;
    exerciseMap: Map<string, IExercise>;
    onDelete: () => void;
}

function Exercise({
    index,
    dayId,
    exerciseId,
    exerciseMap,
    onDelete,
}: ExerciseProps) {
    const deleteExerciseWrapped = useCallback(
        (event) => {
            event.stopPropagation();
            onDelete();
        },
        [onDelete]
    );

    const exercise = exerciseMap.get(exerciseId)!;
    return (
        <Draggable draggableId={exerciseId} index={index}>
            {(provided) => (
                <div
                    className={styles.exercise}
                    key={`${exerciseId}_${index}`}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div
                        className={styles.exerciseHandle}
                        {...provided.dragHandleProps}
                    >
                        <i className='fa-solid fa-grip-lines'></i>
                    </div>
                    <div className={styles.exerciseName}>{exercise.name}</div>
                    <MuscleGroupTag muscleGroup={exercise.primaryMuscleGroup} />
                    <button
                        type='button'
                        onClick={deleteExerciseWrapped}
                        className={styles.deleteIcon}
                    >
                        <i className='fa-solid fa-xmark'></i>
                    </button>
                </div>
            )}
        </Draggable>
    );
}
function setDays(arg0: { exercises: string[]; id: string }[]) {
    throw new Error('Function not implemented.');
}
