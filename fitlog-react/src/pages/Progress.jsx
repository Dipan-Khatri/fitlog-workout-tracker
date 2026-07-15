import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = [
  "#246cf1",
  "#22a75a",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWorkoutDate(workout) {
  const date = new Date(workout.date || workout.createdAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function Progress() {
  const currentUserId =
    localStorage.getItem("fitlogCurrentUserId");

  const workoutKey = currentUserId
    ? `fitlogWorkouts_${currentUserId}`
    : null;

  let workouts = [];

  try {
    workouts = workoutKey
      ? JSON.parse(localStorage.getItem(workoutKey)) || []
      : [];
  } catch (error) {
    console.error("Unable to load workouts:", error);
    workouts = [];
  }

  const totalDuration = workouts.reduce(
    (total, workout) =>
      total + Number(workout.duration || 0),
    0
  );

  const totalSets = workouts.reduce(
    (total, workout) =>
      total + Number(workout.sets || 0),
    0
  );

  const totalReps = workouts.reduce(
    (total, workout) =>
      total + Number(workout.reps || 0),
    0
  );

  const totalVolume = workouts.reduce(
    (total, workout) =>
      total +
      Number(workout.sets || 0) *
        Number(workout.reps || 0) *
        Number(workout.weight || 0),
    0
  );

  const highestWeight = workouts.reduce(
    (highest, workout) =>
      Math.max(highest, Number(workout.weight || 0)),
    0
  );

  const averageDuration =
    workouts.length > 0
      ? Math.round(totalDuration / workouts.length)
      : 0;

  const uniqueWorkoutDates = [
    ...new Set(
      workouts
        .map((workout) => workout.date)
        .filter(Boolean)
    ),
  ];

  function calculateCurrentStreak() {
    const workoutDateSet = new Set(uniqueWorkoutDates);

    let streak = 0;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (!workoutDateSet.has(formatDateKey(currentDate))) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (workoutDateSet.has(formatDateKey(currentDate))) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  const currentStreak = calculateCurrentStreak();

  /*
   * LAST SEVEN DAYS
   * Shows workouts, duration, and volume for each day.
   */
  const weeklyChartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      const dateKey = formatDateKey(date);

      const dailyWorkouts = workouts.filter(
        (workout) => workout.date === dateKey
      );

      const duration = dailyWorkouts.reduce(
        (total, workout) =>
          total + Number(workout.duration || 0),
        0
      );

      const volume = dailyWorkouts.reduce(
        (total, workout) =>
          total +
          Number(workout.sets || 0) *
            Number(workout.reps || 0) *
            Number(workout.weight || 0),
        0
      );

      return {
        date: dateKey,
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        workouts: dailyWorkouts.length,
        duration,
        volume,
      };
    });
  }, [workouts]);

  /*
   * LAST SIX WEEKS
   * Groups workout volume and duration into weekly totals.
   */
  const volumeTrendData = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const endDate = new Date();

      endDate.setHours(23, 59, 59, 999);
      endDate.setDate(endDate.getDate() - (5 - index) * 7);

      const startDate = new Date(endDate);

      startDate.setDate(endDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      const weeklyWorkouts = workouts.filter((workout) => {
        const workoutDate = getWorkoutDate(workout);

        return (
          workoutDate &&
          workoutDate >= startDate &&
          workoutDate <= endDate
        );
      });

      const volume = weeklyWorkouts.reduce(
        (total, workout) =>
          total +
          Number(workout.sets || 0) *
            Number(workout.reps || 0) *
            Number(workout.weight || 0),
        0
      );

      const duration = weeklyWorkouts.reduce(
        (total, workout) =>
          total + Number(workout.duration || 0),
        0
      );

      return {
        week: `Week ${index + 1}`,
        volume,
        duration,
        workouts: weeklyWorkouts.length,
      };
    });
  }, [workouts]);

  /*
   * EXERCISE DISTRIBUTION
   * Counts how frequently each exercise was recorded.
   */
  const exerciseDistribution = useMemo(() => {
    const counts = {};

    workouts.forEach((workout) => {
      const exercise =
        workout.exerciseName?.trim() || "Other";

      counts[exercise] = (counts[exercise] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((first, second) => second.value - first.value)
      .slice(0, 6);
  }, [workouts]);

  const favoriteExercise =
    exerciseDistribution.length > 0
      ? exerciseDistribution[0].name
      : "Not available";

  const achievementDefinitions = [
    {
      id: "first-workout",
      title: "First Workout",
      description: "Complete your first workout.",
      icon: "🏅",
      unlocked: workouts.length >= 1,
      progress: Math.min(workouts.length, 1),
      goal: 1,
      progressLabel: `${Math.min(workouts.length, 1)} / 1 workout`,
    },
    {
      id: "five-workouts",
      title: "Getting Consistent",
      description: "Complete 5 workouts.",
      icon: "💪",
      unlocked: workouts.length >= 5,
      progress: Math.min(workouts.length, 5),
      goal: 5,
      progressLabel: `${Math.min(workouts.length, 5)} / 5 workouts`,
    },
    {
      id: "ten-workouts",
      title: "Workout Warrior",
      description: "Complete 10 workouts.",
      icon: "🏆",
      unlocked: workouts.length >= 10,
      progress: Math.min(workouts.length, 10),
      goal: 10,
      progressLabel: `${Math.min(workouts.length, 10)} / 10 workouts`,
    },
    {
      id: "one-thousand-volume",
      title: "1,000 Pound Club",
      description: "Lift a total volume of 1,000 lbs.",
      icon: "⚡",
      unlocked: totalVolume >= 1000,
      progress: Math.min(totalVolume, 1000),
      goal: 1000,
      progressLabel: `${Math.min(
        totalVolume,
        1000
      ).toLocaleString()} / 1,000 lbs`,
    },
    {
      id: "five-thousand-volume",
      title: "Strength Builder",
      description: "Lift a total volume of 5,000 lbs.",
      icon: "🏋️",
      unlocked: totalVolume >= 5000,
      progress: Math.min(totalVolume, 5000),
      goal: 5000,
      progressLabel: `${Math.min(
        totalVolume,
        5000
      ).toLocaleString()} / 5,000 lbs`,
    },
    {
      id: "three-day-streak",
      title: "Three-Day Streak",
      description:
        "Record workouts on 3 consecutive days.",
      icon: "🔥",
      unlocked: currentStreak >= 3,
      progress: Math.min(currentStreak, 3),
      goal: 3,
      progressLabel: `${Math.min(
        currentStreak,
        3
      )} / 3 days`,
    },
    {
      id: "seven-day-streak",
      title: "Consistency Master",
      description:
        "Record workouts on 7 consecutive days.",
      icon: "⭐",
      unlocked: currentStreak >= 7,
      progress: Math.min(currentStreak, 7),
      goal: 7,
      progressLabel: `${Math.min(
        currentStreak,
        7
      )} / 7 days`,
    },
    {
      id: "three-hundred-minutes",
      title: "Time Under Tension",
      description:
        "Complete 300 total workout minutes.",
      icon: "⏱️",
      unlocked: totalDuration >= 300,
      progress: Math.min(totalDuration, 300),
      goal: 300,
      progressLabel: `${Math.min(
        totalDuration,
        300
      )} / 300 minutes`,
    },
  ];

  const unlockedAchievements =
    achievementDefinitions.filter(
      (achievement) => achievement.unlocked
    );

  const completionPercentage = Math.round(
    (unlockedAchievements.length /
      achievementDefinitions.length) *
      100
  );

  return (
    <section className="content-page progress-page">
      <header className="page-title">
        <p className="page-eyebrow">Fitness Analytics</p>

        <h1>Progress & Achievements</h1>

        <p>
          Explore your workout trends, performance, and
          milestones.
        </p>
      </header>

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-icon blue">🏋️</div>

          <div>
            <span>Workouts</span>
            <strong>{workouts.length}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">◷</div>

          <div>
            <span>Total Duration</span>
            <strong>{totalDuration} min</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon orange">↗</div>

          <div>
            <span>Total Volume</span>
            <strong>
              {totalVolume.toLocaleString()} lbs
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon purple">↑</div>

          <div>
            <span>Highest Weight</span>
            <strong>{highestWeight} lbs</strong>
          </div>
        </article>
      </div>

      {workouts.length === 0 ? (
        <div className="progress-empty-state">
          <div>📊</div>

          <h2>No chart data available yet</h2>

          <p>
            Add workouts to begin generating personalized
            charts and fitness analytics.
          </p>
        </div>
      ) : (
        <>
          <section className="progress-chart-grid">
            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>Weekly Activity</h2>
                  <p>Workouts completed during the last seven days</p>
                </div>

                <span className="chart-badge">7 days</span>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5ebf3"
                    />

                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      cursor={{
                        fill: "rgba(36, 108, 241, 0.06)",
                      }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #dce6f2",
                      }}
                    />

                    <Bar
                      dataKey="workouts"
                      name="Workouts"
                      fill="#246cf1"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>Volume Trend</h2>
                  <p>Total weight volume over six weeks</p>
                </div>

                <span className="chart-badge">6 weeks</span>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={volumeTrendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="volumeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#246cf1"
                          stopOpacity={0.4}
                        />

                        <stop
                          offset="95%"
                          stopColor="#246cf1"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5ebf3"
                    />

                    <XAxis
                      dataKey="week"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toLocaleString()} lbs`,
                        "Volume",
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #dce6f2",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="volume"
                      name="Volume"
                      stroke="#246cf1"
                      strokeWidth={3}
                      fill="url(#volumeGradient)"
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          <section className="progress-chart-grid secondary">
            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>Workout Duration</h2>
                  <p>Minutes trained during the last seven days</p>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5ebf3"
                    />

                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `${value} minutes`,
                        "Duration",
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #dce6f2",
                      }}
                    />

                    <Bar
                      dataKey="duration"
                      name="Duration"
                      fill="#22a75a"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>Exercise Distribution</h2>
                  <p>Your most frequently recorded exercises</p>
                </div>
              </div>

              {exerciseDistribution.length === 0 ? (
                <div className="chart-empty-message">
                  No exercise data available.
                </div>
              ) : (
                <div className="chart-container pie-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={exerciseDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                      >
                        {exerciseDistribution.map(
                          (entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={
                                chartColors[
                                  index % chartColors.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        formatter={(value) => [
                          `${value} workout${
                            value === 1 ? "" : "s"
                          }`,
                          "Recorded",
                        ]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #dce6f2",
                        }}
                      />

                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "12px",
                          color: "#71809a",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>
          </section>
        </>
      )}

      <section className="personal-records-section">
        <div className="section-heading">
          <div>
            <h2>Personal Records</h2>
            <p>Your most important workout statistics</p>
          </div>
        </div>

        <div className="personal-record-grid">
          <article>
            <span>🏋️</span>
            <div>
              <small>Highest Weight</small>
              <strong>{highestWeight} lbs</strong>
            </div>
          </article>

          <article>
            <span>⏱️</span>
            <div>
              <small>Average Duration</small>
              <strong>{averageDuration} min</strong>
            </div>
          </article>

          <article>
            <span>🔥</span>
            <div>
              <small>Current Streak</small>
              <strong>
                {currentStreak}{" "}
                {currentStreak === 1 ? "day" : "days"}
              </strong>
            </div>
          </article>

          <article>
            <span>⭐</span>
            <div>
              <small>Favorite Exercise</small>
              <strong>{favoriteExercise}</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="achievement-section">
        <div className="achievement-section-header">
          <div>
            <h2>Your Achievements</h2>

            <p>
              Badges unlock automatically when you reach each
              milestone.
            </p>
          </div>

          <span>
            {unlockedAchievements.length} of{" "}
            {achievementDefinitions.length} unlocked
          </span>
        </div>

        <div className="achievement-overall-progress">
          <div>
            <strong>{completionPercentage}%</strong>
            <span>Achievement completion</span>
          </div>

          <div className="achievement-main-progress compact">
            <div
              className="achievement-main-progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="achievement-grid">
          {achievementDefinitions.map((achievement) => {
            const progressPercentage = Math.min(
              (achievement.progress / achievement.goal) * 100,
              100
            );

            return (
              <article
                key={achievement.id}
                className={
                  achievement.unlocked
                    ? "achievement-card unlocked"
                    : "achievement-card locked"
                }
              >
                <div className="achievement-card-top">
                  <div className="achievement-icon">
                    {achievement.unlocked
                      ? achievement.icon
                      : "🔒"}
                  </div>

                  <div
                    className={
                      achievement.unlocked
                        ? "achievement-status unlocked"
                        : "achievement-status locked"
                    }
                  >
                    {achievement.unlocked
                      ? "Unlocked"
                      : "Locked"}
                  </div>
                </div>

                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>

                <div className="achievement-card-progress">
                  <div
                    className="achievement-card-progress-fill"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>

                <span className="achievement-progress-label">
                  {achievement.progressLabel}
                </span>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default Progress;
