import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
  useContext,
  useLayoutEffect,
  createContext,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

// Context setup for Example 6
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export default function ReactHooks() {
  const [activeTab, setActiveTab] = useState('useState');
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const tabs = [
    'useState',
    'useEffect',
    'useRef',
    'useMemo',
    'useCallback',
    'useContext',
    'useReducer',
    'useLayoutEffect',
  ];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <View
        style={[
          styles.container,
          theme === 'dark' && styles.darkContainer,
        ]}
      >
        <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
          React Native Hooks Practice Sandbox
        </Text>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Active Demo Canvas */}
        <ScrollView style={styles.demoArea}>
          {activeTab === 'useState' && <UseStateDemo />}
          {activeTab === 'useEffect' && <UseEffectDemo />}
          {activeTab === 'useRef' && <UseRefDemo />}
          {activeTab === 'useMemo' && <UseMemoDemo />}
          {activeTab === 'useCallback' && <UseCallbackDemo />}
          {activeTab === 'useContext' && <UseContextDemo />}
          {activeTab === 'useReducer' && <UseReducerDemo />}
          {activeTab === 'useLayoutEffect' && <UseLayoutEffectDemo />}
        </ScrollView>
      </View>
    </ThemeContext.Provider>
  );
}

// -----------------------------------------------------------------
// 1. useState: Local component state management
// -----------------------------------------------------------------
function UseStateDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>1. useState Demo</Text>
      <Text style={styles.description}>
        Manages component-level state and triggers re-renders on update.
      </Text>

      <Text style={styles.label}>Counter: {count}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setCount((prev) => prev + 1)}
        >
          <Text style={styles.btnText}>+ Increment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnDanger]}
          onPress={() => setCount(0)}
        >
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { marginTop: 15 }]}>Controlled Input:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type something..."
      />
      <Text style={styles.subtext}>You typed: {text}</Text>
    </View>
  );
}

// -----------------------------------------------------------------
// 2. useEffect: Handles side effects & lifecycle events
// -----------------------------------------------------------------
function UseEffectDemo() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    // Cleanup function executes when component unmounts or deps change
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>2. useEffect Demo</Text>
      <Text style={styles.description}>
        Executes side-effects (timers, subscriptions, API calls) and cleans them up.
      </Text>

      <Text style={styles.timerText}>{seconds}s</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Text style={styles.btnText}>{isRunning ? 'Pause' : 'Start Timer'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnDanger]}
          onPress={() => {
            setIsRunning(false);
            setSeconds(0);
          }}
        >
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// -----------------------------------------------------------------
// 3. useRef: Persist mutable values without triggering re-render
// -----------------------------------------------------------------
function UseRefDemo() {
  const [renderCount, setRenderCount] = useState(0);
  const inputRef = useRef(null);
  const renderCounterRef = useRef(0);

  // Increment ref on every render without triggering a new render
  renderCounterRef.current += 1;

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Direct DOM/native node imperative manipulation
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>3. useRef Demo</Text>
      <Text style={styles.description}>
        Holds a mutable reference that does NOT trigger re-renders when changed, or holds direct references to native nodes.
      </Text>

      <Text style={styles.subtext}>
        Component renders so far: {renderCounterRef.current}
      </Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Target input for focus"
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={handleFocus}>
          <Text style={styles.btnText}>Focus TextInput Imperatively</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => setRenderCount((p) => p + 1)}
        >
          <Text style={styles.btnText}>Force Re-render ({renderCount})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// -----------------------------------------------------------------
// 4. useMemo: Caches heavy calculation results across renders
// -----------------------------------------------------------------
function UseMemoDemo() {
  const [num, setNum] = useState(10);
  const [dark, setDark] = useState(false);

  // Expensive calculation function
  const slowSquare = (n) => {
    // Simulate heavy calculation
    let i = 0;
    while (i < 10000000) i++;
    return n * n;
  };

  // Caches result until 'num' changes
  const squaredValue = useMemo(() => {
    return slowSquare(num);
  }, [num]);

  return (
    <View style={[styles.card, dark && { backgroundColor: '#333' }]}>
      <Text style={[styles.cardHeader, dark && { color: '#fff' }]}>
        4. useMemo Demo
      </Text>
      <Text style={[styles.description, dark && { color: '#ccc' }]}>
        Caches the result of an expensive calculation to avoid recalculating on unrelated re-renders.
      </Text>

      <Text style={[styles.label, dark && { color: '#fff' }]}>
        Number: {num} | Squared Result: {squaredValue}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setNum((n) => n + 1)}
        >
          <Text style={styles.btnText}>Change Number (+1)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => setDark((d) => !d)}
        >
          <Text style={styles.btnText}>Toggle Background Style</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// -----------------------------------------------------------------
// 5. useCallback: Caches function definitions across renders
// -----------------------------------------------------------------
function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState(['Item 1', 'Item 2']);

  // Preserves function reference identity unless 'items' changes
  const addItem = useCallback(() => {
    setItems((prevItems) => [...prevItems, `Item ${prevItems.length + 1}`]);
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>5. useCallback Demo</Text>
      <Text style={styles.description}>
        Caches function references to prevent unnecessary re-renders of memoized child components.
      </Text>

      <Text style={styles.label}>Parent Counter: {count}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.btnText}>Increment Counter</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 15 }}>
        <TouchableOpacity style={styles.btn} onPress={addItem}>
          <Text style={styles.btnText}>Add Item (Memoized Function)</Text>
        </TouchableOpacity>
        {items.map((item, index) => (
          <Text key={index} style={styles.subtext}>
            • {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

// -----------------------------------------------------------------
// 6. useContext: Consumes contextual values without prop drilling
// -----------------------------------------------------------------
function UseContextDemo() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>6. useContext Demo</Text>
      <Text style={styles.description}>
        Accesses context values directly without passing props through intermediate components.
      </Text>

      <Text style={styles.label}>Current Theme: {theme.toUpperCase()}</Text>
      <TouchableOpacity style={styles.btn} onPress={toggleTheme}>
        <Text style={styles.btnText}>Toggle App Theme Context</Text>
      </TouchableOpacity>
    </View>
  );
}

// -----------------------------------------------------------------
// 7. useReducer: Redux-style complex state management
// -----------------------------------------------------------------
const initialTodoState = [
  { id: 1, text: 'Learn React Native Hooks', completed: false },
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        { id: Date.now(), text: action.payload, completed: false },
      ];
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    default:
      return state;
  }
}

function UseReducerDemo() {
  const [todos, dispatch] = useReducer(todoReducer, initialTodoState);
  const [inputText, setInputText] = useState('');

  const handleAdd = () => {
    if (inputText.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputText });
      setInputText('');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>7. useReducer Demo</Text>
      <Text style={styles.description}>
        Manages complex state logic through pure reducer functions and dispatched actions.
      </Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="New Task..."
        />
        <TouchableOpacity style={styles.btn} onPress={handleAdd}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 12 }}>
        {todos.map((todo) => (
          <TouchableOpacity
            key={todo.id}
            onPress={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
          >
            <Text
              style={[
                styles.subtext,
                todo.completed && { textDecorationLine: 'line-through', color: '#888' },
              ]}
            >
              [{todo.completed ? '✓' : ' '}] {todo.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// -----------------------------------------------------------------
// 8. useLayoutEffect: Runs synchronously before painting
// -----------------------------------------------------------------
function UseLayoutEffectDemo() {
  const [value, setValue] = useState(0);

  // Fires synchronously after all DOM/Layout mutations but before paint
  useLayoutEffect(() => {
    if (value === 0) {
      setValue(Math.floor(Math.random() * 100) + 1);
    }
  }, [value]);

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>8. useLayoutEffect Demo</Text>
      <Text style={styles.description}>
        Runs synchronously after layouts are calculated, preventing visual flickers when measuring or modifying layout nodes.
      </Text>

      <Text style={styles.label}>Synchronously Calculated Value: {value}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => setValue(0)}>
        <Text style={styles.btnText}>Reset & Trigger Layout Re-calculation</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: 50,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  darkText: {
    color: '#ffffff',
  },
  tabContainer: {
    maxHeight: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    height: 40,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  demoArea: {
    padding: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#007AFF',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  subtext: {
    fontSize: 14,
    color: '#444',
    marginVertical: 4,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#2d3436',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDanger: {
    backgroundColor: '#dc3545',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});