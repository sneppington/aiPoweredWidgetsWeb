function MyComponent({ onMount }) {
    // Runs after the component is mounted
    useEffect(() => {
      if (onMount) onMount();
    }, []);
  
    return (
        <>
        </>
    );
  }
  