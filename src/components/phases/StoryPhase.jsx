// src/components/phases/StoryPhase.jsx
import React, { useEffect, useState } from 'react';
import './StoryPhase.css';
import { useAudio } from '../../hooks/useAudio.js';
import { storyNarration } from '../../utils/narration.js';

const STORY_SLIDES = [
  {
    id: 1,
    title: "Every Problem Tells a Story",
    audioKey: "story_1",
    image: "/assets/images/slide1.png",
    imageEmoji: "📖",
    imageBg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    quote: "Understand first, calculate later!",
    bubble: "Let's turn every wordy story into something we can see and solve!",
    text: "Word problems are little stories with numbers hiding inside. Imagine a book and a bookmark cost $11 together, and the book costs $10 more than the bookmark. How much is the bookmark? Before we calculate anything, we must understand the story."
  },
  {
    id: 2,
    title: "Step 1: Understand the Story",
    audioKey: "story_2",
    image: "/assets/images/slide2.png",
    imageEmoji: "🔍",
    imageBg: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    quote: "Given · Asked · Relationship",
    bubble: "Detectives never guess — they collect clues first!",
    text: "Ask three detective questions: What is given? What am I asked to find? And how are the quantities related? Underline the facts, circle the question, and ignore details that do not change the answer."
  },
  {
    id: 3,
    title: "Give the Unknown a Name",
    audioKey: "story_3",
    image: "/assets/images/slide3.png",
    imageEmoji: "🔤",
    imageBg: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)",
    quote: "Let b = price of the bookmark ($)",
    bubble: "A letter is just a box that holds the mystery number!",
    text: "Every problem has a mystery quantity, so give it a letter! Let b stand for the price of the bookmark in dollars. Then the book costs b + 10, because it is $10 more. Always say what your letter means, and include its unit."
  },
  {
    id: 4,
    title: "Represent It with a Bar Model",
    audioKey: "story_4",
    image: "/assets/images/slide4.png",
    imageEmoji: "📊",
    imageBg: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    quote: "b + (b + 10) = 11",
    bubble: "Short bar, long bar, extra piece — the picture does the thinking!",
    text: "Draw one bar for each quantity. The bookmark is a short bar, b. The book is the same bar plus an extra piece worth $10. Together, the two bars make $11. Now the whole relationship is visible at a glance!"
  },
  {
    id: 5,
    title: "Represent It with a Table",
    audioKey: "story_5",
    image: "/assets/images/slide5.png",
    imageEmoji: "📋",
    imageBg: "linear-gradient(135deg, #701a75 0%, #86198f 100%)",
    quote: "Fare = 2 × km + 3",
    bubble: "Patterns in a table are clues to the equation!",
    text: "Tables help when something changes step by step. A taxi charges $3 to start, plus $2 for every kilometre. List 1, 2, 3 and 4 kilometres, and the fare goes up by 2 each time. Spot the pattern, and you can write the rule."
  },
  {
    id: 6,
    title: "Represent It with an Equation",
    audioKey: "story_6",
    image: "/assets/images/slide6.png",
    imageEmoji: "🧮",
    imageBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    quote: "2n + 3 = 17",
    bubble: "Words in, symbols out — you're the translator!",
    text: "Now translate words into symbols. Three more than twice a number is 17 becomes 2n + 3 = 17. More than means add, twice means multiply by 2, and is means equals. Read your equation back in words to check that it tells the same story."
  },
  {
    id: 7,
    title: "Solve, Then Check the Story",
    audioKey: "story_7",
    image: "/assets/images/slide7.png",
    imageEmoji: "✅",
    imageBg: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
    quote: "Always check your answer against the story!",
    bubble: "A correct answer must fit every clue in the problem!",
    text: "Time to solve. The bar model gives b + b + 10 = 11, so 2b = 1 and b = 0.5. The bookmark costs 50 cents and the book costs $10.50. Check it: 0.50 + 10.50 = 11, and the book is exactly $10 more. It fits the story, so the answer makes sense!"
  },
  {
    id: 8,
    title: "Step Into the Simulation Lab!",
    audioKey: "story_8",
    image: "/assets/images/slide8.png",
    imageEmoji: "🧪",
    imageBg: "linear-gradient(135deg, #581c87 0%, #6b21a8 100%)",
    quote: "Ready to test your problem-solving skills?",
    bubble: "Click below to enter the interactive lab!",
    text: "Awesome job! You can now understand a problem, name the unknown, and represent it with a bar model, a table, or an equation. Step into the lab to highlight clues, build models, and solve puzzles!"
  }
];

function StoryImage({ slide }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [slide.id]);

  return (
    <div className="story-image-container">
      {!imgError && slide.image ? (
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          onError={() => setImgError(true)}
          className="story-full-img"
        />
      ) : (
        <div className="story-img-fallback" style={{ background: slide.imageBg }}>
          <span className="fallback-emoji">{slide.imageEmoji}</span>
          <span className="fallback-title">{slide.title}</span>
          <span className="fallback-highlight">{slide.quote}</span>
        </div>
      )}
    </div>
  );
}

export default function StoryPhase({ state, dispatch }) {
  const currentPanel = state?.storyPanel || 0;
  const slide = STORY_SLIDES[currentPanel] || STORY_SLIDES[0];
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const totalPanels = STORY_SLIDES.length;
  const isLastPanel = currentPanel >= totalPanels - 1;

  useEffect(() => {
    stopAll();
    const timer = setTimeout(() => {
      narrate(storyNarration(currentPanel));
    }, 300);
    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [currentPanel, narrate, stopAll]);

  function handleNext() {
    stopAll();
    if (isLastPanel) {
      dispatch({ type: 'COMPLETE_PHASE', payload: 'story' });
      dispatch({ type: 'SET_PHASE', payload: 'simulate' });
    } else {
      dispatch({ type: 'NEXT_STORY_PANEL' });
    }
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  return (
    <div className="story-wrap">
      <div className="story-container anim-slide-up" key={currentPanel}>
        {/* Top Progress Bar Row */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${((currentPanel + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">{currentPanel + 1} / {totalPanels}</span>
        </div>

        {/* Main Horizontal Story Card */}
        <div className="story-main-card">
          {/* Left: Complete Image in full frame */}
          <div className="story-image-section">
            <StoryImage slide={slide} />
          </div>

          {/* Right: Story Content */}
          <div className="story-content-section">
            <h2 className="story-title">{slide.title}</h2>
            <p className="story-text">{slide.text}</p>

            {slide.quote && (
              <div className="story-prompt-pill">
                <span className="prompt-icon">💡</span>
                <span className="prompt-text">{slide.quote}</span>
              </div>
            )}

            {slide.bubble && (
              <div className="story-bubble-pill">
                <span className="bubble-icon">💬</span>
                <span className="bubble-text">{slide.bubble}</span>
              </div>
            )}

            {/* Navigation Buttons Row */}
            <div className="story-footer-nav">
              <button
                className="btn btn-outline btn-md"
                onClick={handlePrev}
                disabled={currentPanel === 0}
              >
                ← Back
              </button>

              <button
                className="btn btn-primary btn-md"
                onClick={handleNext}
              >
                {isLastPanel ? 'Enter Simulation Lab 🧪' : 'Next Clue →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
