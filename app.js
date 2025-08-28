const stage = new NGL.Stage("viewport");
let loadedStructure = null;
let fullStickRepr = null;
let cartoonRepr = null;
let isCartoonVisible = true;
let isStickVisible = false;
let highlightCounter = 1;
let isLoading = false;

     // 안전한 카메라 컨트롤 함수들
 function safeResetCamera() {
   try {
     if (stage && stage.viewerControls && loadedStructure) {
       // 단백질 구조가 로드되어 있는지 확인
       if (!loadedStructure || !loadedStructure.reprList || loadedStructure.reprList.length === 0) {
         console.warn('No structure loaded for camera reset');
         return;
       }
       
       // 부드러운 리셋을 위해 단계적으로 이동
       stage.viewerControls.reset();
       
       // 구조가 보이도록 약간의 조정
       setTimeout(() => {
         if (stage && stage.viewerControls && loadedStructure) {
           stage.viewerControls.zoom(-0.3); // 약간 축소
           
           // 구조가 너무 멀리 있으면 가까이 이동
           setTimeout(() => {
             if (stage && stage.viewerControls) {
               const currentZoom = stage.viewerControls.getZoom();
               if (currentZoom < 0.5) {
                 stage.viewerControls.zoom(0.5);
               }
             }
           }, 200);
         }
       }, 100);
     }
   } catch (error) {
     console.error('Reset camera error:', error);
     // 에러 발생 시 안전한 복구
     try {
       if (stage && stage.viewerControls) {
         stage.viewerControls.reset();
         setTimeout(() => {
           if (stage && stage.viewerControls) {
             stage.viewerControls.zoom(-0.3);
           }
         }, 100);
       }
     } catch (recoveryError) {
       console.error('Camera recovery failed:', recoveryError);
     }
   }
 }

 function safeZoomIn() {
   try {
     if (stage && stage.viewerControls && loadedStructure) {
       // 단백질 구조가 로드되어 있는지 확인
       if (!loadedStructure || !loadedStructure.reprList || loadedStructure.reprList.length === 0) {
         console.warn('No structure loaded for zoom in');
         return;
       }
       
       // 현재 줌 레벨 확인
       const currentZoom = stage.viewerControls.getZoom();
       
       // 너무 가까이 확대되지 않도록 제한
       if (currentZoom < 3.0) {
         stage.viewerControls.zoom(0.3);
       } else {
         console.log('Maximum zoom level reached');
       }
     }
   } catch (error) {
     console.error('Zoom in error:', error);
   }
 }

 function safeZoomOut() {
   try {
     if (stage && stage.viewerControls && loadedStructure) {
       // 단백질 구조가 로드되어 있는지 확인
       if (!loadedStructure || !loadedStructure.reprList || loadedStructure.reprList.length === 0) {
         console.warn('No structure loaded for zoom out');
         return;
       }
       
       // 현재 줌 레벨 확인
       const currentZoom = stage.viewerControls.getZoom();
       
       // 너무 멀리 축소되지 않도록 제한
       if (currentZoom > 0.1) {
         stage.viewerControls.zoom(-0.3);
       } else {
         console.log('Minimum zoom level reached');
       }
     }
   } catch (error) {
     console.error('Zoom out error:', error);
   }
 }

 function safeRotate() {
   try {
     if (stage && stage.viewerControls && loadedStructure) {
       // 단백질 구조가 로드되어 있는지 확인
       if (!loadedStructure || !loadedStructure.reprList || loadedStructure.reprList.length === 0) {
         console.warn('No structure loaded for rotation');
         return;
       }
       
       // 더 부드러운 회전 (90도 대신 45도)
       stage.viewerControls.rotate(0, Math.PI/8);
       
       // 회전 후 구조가 여전히 보이는지 확인
       setTimeout(() => {
         if (stage && stage.viewerControls) {
           const currentZoom = stage.viewerControls.getZoom();
           // 구조가 너무 멀리 있으면 가까이 이동
           if (currentZoom < 0.5) {
             stage.viewerControls.zoom(0.5);
           }
         }
       }, 200);
     }
   } catch (error) {
     console.error('Rotate error:', error);
     // 에러 발생 시 안전한 복구
     try {
       if (stage && stage.viewerControls) {
         stage.viewerControls.zoom(-0.3);
       }
     } catch (recoveryError) {
       console.error('Rotation recovery failed:', recoveryError);
     }
   }
 }

 function safeOrient(position, rotation) {
   try {
     if (stage && stage.viewerControls && loadedStructure) {
       // 단백질 구조가 로드되어 있는지 한 번 더 확인
       if (!loadedStructure || !loadedStructure.reprList || loadedStructure.reprList.length === 0) {
         console.warn('No structure loaded for orientation change');
         return;
       }
       
       // 현재 카메라 상태 저장
       const currentPosition = stage.viewerControls.getPosition();
       
       // 부드러운 방향 전환을 위해 단계적으로 이동
       const targetPosition = position;
       const targetRotation = rotation;
       
       // 단백질 구조가 보이도록 약간의 조정
       stage.viewerControls.orient(targetPosition, targetRotation);
       
       // 방향 전환 후 약간의 확대/축소로 구조가 잘 보이도록 조정
       setTimeout(() => {
         if (stage && stage.viewerControls && loadedStructure) {
           // 구조가 화면에 맞도록 자동 조정
           stage.viewerControls.zoom(-0.2);
           
           // 구조가 여전히 보이는지 확인하고 필요시 추가 조정
           setTimeout(() => {
             if (stage && stage.viewerControls) {
               // 구조가 너무 멀리 있으면 가까이 이동
               const currentZoom = stage.viewerControls.getZoom();
               if (currentZoom < 0.5) {
                 stage.viewerControls.zoom(0.5);
               }
             }
           }, 300);
         }
       }, 200);
     }
   } catch (error) {
     console.error('Orient error:', error);
     // 에러 발생 시 안전한 위치로 복구
     try {
       if (stage && stage.viewerControls) {
         stage.viewerControls.reset();
         setTimeout(() => {
           if (stage && stage.viewerControls) {
             stage.viewerControls.zoom(-0.3);
           }
         }, 100);
       }
     } catch (recoveryError) {
       console.error('Camera recovery failed:', recoveryError);
     }
   }
 }

// 추가 시각화 옵션 함수들
let isDarkBackground = true;
let labelsVisible = false;
let axesVisible = false;
let boxVisible = false;

// 2차 구조 하이라이트 관련 변수
let helixHighlight = null;
let sheetHighlight = null;
let loopHighlight = null;
let helixVisible = false;
let sheetVisible = false;
let loopVisible = false;

// 표면 표현 관련 변수
let surfaceRepr = null;
let sasRepr = null;
let sasPlusRepr = null;
let surfaceVisible = false;
let sasVisible = false;
let sasPlusVisible = false;

// 측정 도구 관련 변수
let distanceMeasure = null;
let angleMeasure = null;
let dihedralMeasure = null;
let distanceVisible = false;
let angleVisible = false;
let dihedralVisible = false;
let currentMeasureTool = null;

// 개발자 모드 관련 변수
let isDeveloperMode = false;
let devToolsVisible = false;

// 스핀 상태 변수
let isSpinning = true;

function setLoadingState(isLoading) {
  // 로딩 상태는 콘솔에만 표시
  if (isLoading) {
    console.log('🔄 로딩중...');
  } else {
    console.log('✅ 로딩 완료');
  }
}

// 개발자 모드 관련 함수들
function toggleDeveloperMode() {
  isDeveloperMode = !isDeveloperMode;
  const body = document.body;
  const devIndicator = document.getElementById('devIndicator');
  const devTools = document.getElementById('devTools');
  
  if (isDeveloperMode) {
    body.classList.add('developer-mode');
    devIndicator.style.display = 'block';
    devTools.style.display = 'block';
    console.log('🔧 Developer Mode Activated!');
    showNotification('Developer Mode Activated!', 'success');
  } else {
    body.classList.remove('developer-mode');
    devIndicator.style.display = 'none';
    devTools.style.display = 'none';
    console.log('🔧 Developer Mode Deactivated!');
    showNotification('Developer Mode Deactivated!', 'info');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10001;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function toggleConsole() {
  if (window.console && window.console.log) {
    const isVisible = console.log.toString().includes('native');
    if (isVisible) {
      console.log('Console toggled off');
      showNotification('Console toggled off', 'info');
    } else {
      console.log('Console toggled on');
      showNotification('Console toggled on', 'info');
    }
  }
}

function showPerformance() {
  if (performance && performance.memory) {
    const mem = performance.memory;
    const info = `Memory: ${Math.round(mem.usedJSHeapSize / 1048576)}MB / ${Math.round(mem.jsHeapSizeLimit / 1048576)}MB`;
    showNotification(info, 'info');
    console.log('Performance Info:', mem);
  }
}

function showDebugInfo() {
  const info = {
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    stage: stage ? 'Active' : 'Inactive',
    loadedStructure: loadedStructure ? 'Yes' : 'No',
    developerMode: isDeveloperMode
  };
  console.log('Debug Info:', info);
  showNotification('Debug info logged to console', 'info');
}

function clearCache() {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
  localStorage.clear();
  sessionStorage.clear();
  showNotification('Cache cleared!', 'success');
}

function testMode() {
  showNotification('Test mode activated!', 'info');
  // 테스트용 더미 데이터 로드
  const testData = `ATOM      1  N   ALA A   1      27.551  24.409   4.697  1.00 20.00           N  
ATOM      2  CA  ALA A   1      26.961  25.784   4.489  1.00 20.00           C  
ATOM      3  C   ALA A   1      25.461  25.694   4.835  1.00 20.00           C  
ATOM      4  O   ALA A   1      24.694  26.646   4.456  1.00 20.00           O  
ATOM      5  CB  ALA A   1      27.401  26.456   3.158  1.00 20.00           C  
TER       6      ALA A   1
END`;
  document.getElementById('pdbInput').value = testData;
  showNotification('Test data loaded!', 'success');
}

function exportData() {
  if (loadedStructure) {
    const data = {
      timestamp: new Date().toISOString(),
      structure: loadedStructure.name,
      representations: {
        cartoon: isCartoonVisible,
        stick: isStickVisible,
        surface: surfaceVisible
      },
      settings: {
        background: isDarkBackground ? 'dark' : 'light',
        spinning: isSpinning
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'protein-viewer-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported!', 'success');
  } else {
    showNotification('No structure loaded to export', 'warning');
  }
}

function showNetworkInfo() {
  if ('connection' in navigator) {
    const conn = navigator.connection;
    const info = `Network: ${conn.effectiveType || 'Unknown'} (${conn.downlink || 'Unknown'} Mbps)`;
    showNotification(info, 'info');
    console.log('Network Info:', conn);
  } else {
    showNotification('Network info not available', 'warning');
  }
}

function toggleWireframe() {
  if (loadedStructure) {
    const wireframeRepr = loadedStructure.addRepresentation("line", {
      colorScheme: "element",
      name: "wireframe"
    });
    showNotification('Wireframe mode toggled!', 'info');
  } else {
    showNotification('No structure loaded', 'warning');
  }
}

// 리사이즈 핸들 초기화 함수
function initResizeHandles() {
          const optionMenuHandle = document.getElementById('optionMenuResizeHandle');
    const viewportLeftHandle = document.getElementById('viewportLeftResizeHandle');
    const viewportRightHandle = document.getElementById('viewportRightResizeHandle');
    
    if (optionMenuHandle) {
      initOptionMenuResize(optionMenuHandle);
    }
    
    if (viewportLeftHandle) {
      initViewportLeftResize(viewportLeftHandle);
    }
    
    if (viewportRightHandle) {
      initViewportRightResize(viewportRightHandle);
    }
}

// 사이드 패널 리사이즈 함수


// 캔버스 우측 리사이즈 함수
function initViewportRightResize(handle) {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  let startSidepanelWidth = 0;
  let minWidth = 200;
  let maxWidth = window.innerWidth * 0.8;

  handle.addEventListener('mousedown', function(e) {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(document.getElementById('viewport').style.width) || 
                (window.innerWidth - parseInt(document.getElementById('sidepanel').style.width) || 300);
    startSidepanelWidth = parseInt(document.getElementById('sidepanel').style.width) || 300;
    
    handle.classList.add('resizing');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isResizing) return;
    
    // 마우스를 오른쪽으로 드래그하면 캔버스가 줄어들고, 왼쪽으로 드래그하면 늘어남
    const currentX = e.clientX;
    const deltaX = -(startX - currentX);
    
    // 캔버스 너비 계산 (사이드 패널과 연동)
    const newViewportWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
    const newSidepanelWidth = window.innerWidth - newViewportWidth;
    
    // 디버깅을 위한 로그
    console.log('Viewport Resize:', {
      startX: startX,
      currentX: currentX,
      deltaX: deltaX,
      startWidth: startWidth,
      newViewportWidth: newViewportWidth,
      newSidepanelWidth: newSidepanelWidth,
      direction: deltaX > 0 ? '오른쪽(캔버스 줄어듦)' : '왼쪽(캔버스 늘어남)'
    });
    
    // 캔버스와 사이드 패널 너비 동시 업데이트
    document.getElementById('viewport').style.width = newViewportWidth + 'px';
    document.getElementById('sidepanel').style.width = newSidepanelWidth + 'px';
    
    // NGL 스테이지 리사이즈
    if (stage && stage.handleResize) {
      setTimeout(() => {
        stage.handleResize();
      }, 10);
    }
  });

  document.addEventListener('mouseup', function() {
    if (isResizing) {
      isResizing = false;
      handle.classList.remove('resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // 로컬 스토리지에 너비 저장
      const viewport = document.getElementById('viewport');
      const sidepanel = document.getElementById('sidepanel');
      const viewportWidth = viewport.style.width || '70%';
      const sidepanelWidth = sidepanel.style.width || '30%';
      
      localStorage.setItem('viewportWidth', viewportWidth);
      localStorage.setItem('sidepanelWidth', sidepanelWidth);
    }
  });
}

// 캔버스 좌측 리사이즈 함수
function initViewportLeftResize(handle) {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  let startSidepanelWidth = 0;
  let minWidth = 200;
  let maxWidth = window.innerWidth * 0.8;

  handle.addEventListener('mousedown', function(e) {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(document.getElementById('viewport').style.width) || 
                (window.innerWidth - parseInt(document.getElementById('sidepanel').style.width) || 300);
    startSidepanelWidth = parseInt(document.getElementById('sidepanel').style.width) || 300;
    
    handle.classList.add('resizing');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isResizing) return;
    
    // 마우스를 오른쪽으로 드래그하면 캔버스가 줄어들고, 왼쪽으로 드래그하면 늘어남
    const currentX = e.clientX;
    const deltaX = currentX - startX;
    
    // 캔버스 너비 계산 (사이드 패널과 연동)
    const newViewportWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - deltaX));
    const newSidepanelWidth = window.innerWidth - newViewportWidth;
    
    // 디버깅을 위한 로그
    console.log('Viewport Left Resize:', {
      startX: startX,
      currentX: currentX,
      deltaX: deltaX,
      startWidth: startWidth,
      newViewportWidth: newViewportWidth,
      newSidepanelWidth: newSidepanelWidth,
      direction: deltaX > 0 ? '오른쪽(캔버스 줄어듦)' : '왼쪽(캔버스 늘어남)'
    });
    
    // 캔버스와 사이드 패널 너비 동시 업데이트
    document.getElementById('viewport').style.width = newViewportWidth + 'px';
    document.getElementById('sidepanel').style.width = newSidepanelWidth + 'px';
    
    // NGL 스테이지 리사이즈
    if (stage && stage.handleResize) {
      setTimeout(() => {
        stage.handleResize();
      }, 10);
    }
  });

  document.addEventListener('mouseup', function() {
    if (isResizing) {
      isResizing = false;
      handle.classList.remove('resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // 로컬 스토리지에 너비 저장
      const viewport = document.getElementById('viewport');
      const sidepanel = document.getElementById('sidepanel');
      const viewportWidth = viewport.style.width || '70%';
      const sidepanelWidth = sidepanel.style.width || '30%';
      
      localStorage.setItem('viewportWidth', viewportWidth);
      localStorage.setItem('sidepanelWidth', sidepanelWidth);
    }
  });
}

// 옵션 메뉴 리사이즈 함수
function initOptionMenuResize(handle) {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  let minWidth = 250;
  let maxWidth = window.innerWidth * 0.6;

  handle.addEventListener('mousedown', function(e) {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(document.getElementById('optionMenu').style.width) || 300;
    
    handle.classList.add('resizing');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isResizing) return;
    
    // 마우스를 왼쪽으로 드래그하면 메뉴가 늘어나고, 오른쪽으로 드래그하면 줄어듦
    // 옵션 메뉴는 오른쪽에서 열리므로, 왼쪽으로 드래그하면 늘어나야 함
    const currentX = e.clientX;
    const deltaX = startX - currentX;
    
    // deltaX가 양수면 왼쪽으로 드래그 (메뉴 늘어남)
    // deltaX가 음수면 오른쪽으로 드래그 (메뉴 줄어듦)
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - deltaX));
    
    // 디버깅을 위한 로그
    console.log('Resize:', {
      startX: startX,
      currentX: currentX,
      deltaX: deltaX,
      startWidth: startWidth,
      newWidth: newWidth,
      direction: deltaX > 0 ? '왼쪽(늘어남)' : '오른쪽(줄어듦)'
    });
    
    document.getElementById('optionMenu').style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (isResizing) {
      isResizing = false;
      handle.classList.remove('resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // 로컬 스토리지에 너비 저장
      const optionMenu = document.getElementById('optionMenu');
      const width = optionMenu.style.width || '300px';
      localStorage.setItem('optionMenuWidth', width);
    }
  });
}

// 저장된 너비 복원 함수
function restoreSavedWidths() {
  const savedSidepanelWidth = localStorage.getItem('sidepanelWidth');
  const savedOptionMenuWidth = localStorage.getItem('optionMenuWidth');
  const savedViewportWidth = localStorage.getItem('viewportWidth');
  
  if (savedSidepanelWidth && savedViewportWidth) {
    // 저장된 너비가 모두 있으면 그대로 복원
    document.getElementById('sidepanel').style.width = savedSidepanelWidth;
    document.getElementById('viewport').style.width = savedViewportWidth;
  } else if (savedSidepanelWidth) {
    // 사이드 패널만 저장된 경우
    document.getElementById('sidepanel').style.width = savedSidepanelWidth;
    const sidepanelWidth = parseFloat(savedSidepanelWidth);
    document.getElementById('viewport').style.width = (100 - sidepanelWidth) + '%';
  } else {
    // 기본값 설정 - 사이드 패널과 뷰포트 연동
    document.getElementById('sidepanel').style.width = '30%';
    document.getElementById('viewport').style.width = '70%';
  }
  
  if (savedOptionMenuWidth) {
    document.getElementById('optionMenu').style.width = savedOptionMenuWidth;
  }
  
  // NGL 스테이지 리사이즈
  if (stage && stage.handleResize) {
    setTimeout(() => {
      stage.handleResize();
    }, 100);
  }
}

// 검색 입력창 이벤트 리스너
document.getElementById('searchInput').addEventListener('input', function() {
  const searchTerm = this.value.trim();
  const resultsDiv = document.getElementById('searchResults');
  
  if (!searchTerm) {
    resultsDiv.style.display = 'none';
    resultsDiv.innerHTML = '';
  }
});

// 리사이즈 기능 초기화
initResizeHandles();

// 저장된 너비 복원
restoreSavedWidths();

        // 리사이즈 핸들 테스트 (개발자 모드에서만)
    if (isDeveloperMode) {
      console.log('🔧 리사이즈 핸들 테스트 모드 활성화');
      console.log('옵션메뉴 핸들:', document.getElementById('optionMenuResizeHandle'));
      console.log('뷰포트 좌측 핸들:', document.getElementById('viewportLeftResizeHandle'));
      console.log('뷰포트 우측 핸들:', document.getElementById('viewportRightResizeHandle'));
    }

// 키보드 단축키 이벤트 리스너
document.addEventListener('keydown', function(e) {
  if (isDeveloperMode) {
    // Ctrl + Shift + D: 개발자 모드 토글
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleDeveloperMode();
    }
    
    // F12: 개발자 도구 토글
    if (e.key === 'F12') {
      e.preventDefault();
      const devTools = document.getElementById('devTools');
      devTools.style.display = devTools.style.display === 'none' ? 'block' : 'none';
    }
    
    // Ctrl + Shift + I: 디버그 정보 표시
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      showDebugInfo();
    }
  }
});

function loadPDB() {
  const pdbText = document.getElementById("pdbInput").value;
  if (!pdbText || pdbText.length < 100) {
    alert("유효한 PDB 또는 CIF 데이터를 붙여넣어주세요.");
    return;
  }
  setLoadingState(true);
  const isCif = pdbText.includes("data_") || pdbText.includes("loop_");
  const blob = new Blob([pdbText], { type: 'text/plain' });
  const ext = isCif ? "cif" : "pdb";

  stage.removeAllComponents();
  highlightCounter = 1;
  stage.loadFile(blob, { ext }).then(setupComponent);
}

function handleFileUpload() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;

  setLoadingState(true);
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileText = e.target.result;
    const isCif = fileText.includes("data_") || fileText.includes("loop_");
    const blob = new Blob([fileText], { type: 'text/plain' });
    const ext = isCif ? "cif" : "pdb";

    stage.removeAllComponents();
    highlightCounter = 1;
    stage.loadFile(blob, { ext }).then(setupComponent);
  };
  reader.readAsText(file);
}

function setupComponent(component) {
  loadedStructure = component;
  fullStickRepr = null;
  cartoonRepr = component.addRepresentation("cartoon", {
    colorScheme: "residueindex",
    name: "mainCartoon"
  });
  isCartoonVisible = true;
  isStickVisible = false;
  updateToggleButtonText();
  updateMainBtnState();

  // 기본 스타일 설정
  isSpinning = true;
  stage.setSpin(isSpinning);  // 기본적으로 스핀 활성화

  component.autoView();
  setLoadingState(false);

  stage.signals.clicked.add(function (pickingProxy) {
    if (!pickingProxy || !pickingProxy.atom) {
      document.getElementById('highlightOverlay').style.display = 'none';
      return;
    }

    const a = pickingProxy.atom;

    // 하이라이트 설명 오버레이 표시
    const overlay = document.getElementById('highlightOverlay');
    const content = document.getElementById('highlightOverlayContent');
    content.innerHTML = `
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">하이라이트</div>
      <div style="font-size: 12px;"><b>${a.resname}</b> ${a.chainname}:${a.resno}</div>
      <div style="font-size: 11px; color: var(--text-secondary);">${a.atomname}</div>
    `;
    overlay.style.display = 'block';
    
    // 초기 크기 설정
    overlay.style.width = '200px';
    overlay.style.height = '120px';
    
    const center = [a.x, a.y, a.z];
    const nearbyResidues = new Set();
    
    // 클릭한 원자 주변의 근접한 중합체 찾기
    loadedStructure.structure.eachAtom(function (atom) {
      const dx = atom.x - center[0];
      const dy = atom.y - center[1];
      const dz = atom.z - center[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // 3.0Å 이내의 원자들을 포함 (더 넓은 범위)
      if (dist <= 3.0) {
        nearbyResidues.add(`${atom.resno} and :${atom.chainname}`);
      }
    });

    const selection = Array.from(nearbyResidues).join(" OR ");
    
    // 이전 하이라이트 제거
    loadedStructure.reprList.forEach(repr => {
      if (repr.name.startsWith("highlight")) {
        loadedStructure.removeRepresentation(repr);
      }
    });

    // 모든 환경에서 하이라이트 표시
    if (selection) {
      // 근접한 중합체를 ball+stick으로 표시
      loadedStructure.addRepresentation("ball+stick", {
        sele: selection,
        name: `highlight${highlightCounter}`,
        color: "element",
        multipleBond: true,
        scale: 2.5
      });
      highlightCounter++;

      // 추가로 cartoon representation으로도 표시 (더 명확한 구조)
      loadedStructure.addRepresentation("cartoon", {
        sele: selection,
        name: `highlight${highlightCounter}`,
        color: "red",
        opacity: 0.8
      });
      highlightCounter++;

      // 클릭한 부분으로 카메라 이동 (모든 환경에서)
      try {
        if (typeof NGL !== 'undefined' && NGL.Vector3) {
          const centerVector = new NGL.Vector3(a.x, a.y, a.z);
          const radius = 8; // 적절한 시야 거리
          stage.animationControls.move(centerVector, radius, 1000); // 1초 동안 부드럽게 이동
        }
      } catch (e) {
        console.warn('Camera movement failed:', e);
      }
    }
  });

  // 측정 도구 초기화
  clearCurrentMeasureTool();
}

function toggleMainStructure() {
  // cartoon representation이 있을 때만 동작
  if (!cartoonRepr) return;
  isCartoonVisible = !isCartoonVisible;
  cartoonRepr.setVisibility(isCartoonVisible);
  updateMainBtnText();
}

// Style이 cartoon일 때만 버튼 활성화, 아니면 disabled
function updateMainBtnState() {
  const btn = document.getElementById("toggleMainBtn");
  // cartoonRepr이 존재하면 cartoon 스타일인 것으로 판단
  const isCartoonStyle = cartoonRepr !== null;
  btn.disabled = !isCartoonStyle;
  btn.style.opacity = isCartoonStyle ? '1' : '0.5';
  updateMainBtnText();
}

function updateMainBtnText() {
  const btn = document.getElementById("toggleMainBtn");
  const span = btn.querySelector('span') || document.createElement('span');
  if (!btn.querySelector('span')) {
    btn.innerHTML = `<i class="fas fa-layer-group"></i><span>${isCartoonVisible ? "단백질 구조 숨기기" : "단백질 구조 보기"}</span>`;
  } else {
    span.textContent = isCartoonVisible ? "단백질 구조 숨기기" : "단백질 구조 보기";
  }
}

function toggleStickStructure() {
  const btn = document.getElementById("toggleStickBtn");
  if (!loadedStructure) return;

  if (isStickVisible) {
    loadedStructure.removeRepresentation(fullStickRepr);
    fullStickRepr = null;
  } else {
    fullStickRepr = loadedStructure.addRepresentation("ball+stick", {
      name: "fullstick",
      color: "element",
      multipleBond: true,
      scale: 1.5
    });
  }
  isStickVisible = !isStickVisible;
  updateToggleButtonText();
}

function updateToggleButtonText() {
  const btn = document.getElementById("toggleStickBtn");
  const span = btn.querySelector('span') || document.createElement('span');
  if (!btn.querySelector('span')) {
    btn.innerHTML = `<i class="fas fa-atom"></i><span>${isStickVisible ? "중합체 숨기기" : "중합체 보기"}</span>`;
  } else {
    span.textContent = isStickVisible ? "중합체 숨기기" : "중합체 보기";
  }
}

function clearHighlights() {
  if (!loadedStructure) return;
  loadedStructure.reprList.forEach(repr => {
    if (repr.name.startsWith("highlight")) {
      loadedStructure.removeRepresentation(repr);
    }
  });
  highlightCounter = 1;
}

// 한국어-영어 단백질 이름 매핑 (자주 사용되는 단백질)
const proteinNameMapping = {
  'p53': 'p53',
  '브르카': 'BRCA1',
  '브르카1': 'BRCA1',
  '브르카2': 'BRCA2',
  '인슐린': 'insulin',
  '헤모글로빈': 'hemoglobin',
  '알부민': 'albumin',
  '콜라겐': 'collagen',
  '케라틴': 'keratin',
  '액틴': 'actin',
  '미오신': 'myosin',
  '튜불린': 'tubulin',
  '시토크롬': 'cytochrome',
  '효소': 'enzyme',
  '수용체': 'receptor',
  '항체': 'antibody',
  '인터페론': 'interferon',
  '인터류킨': 'interleukin',
  '성장호르몬': 'growth hormone',
  '에스트로겐': 'estrogen',
  '테스토스테론': 'testosterone',
  '프로게스테론': 'progesterone',
  '갑상선호르몬': 'thyroid hormone',
  '부신피질호르몬': 'cortisol',
  '인슐린유사성장인자': 'insulin-like growth factor',
  '혈관내피성장인자': 'vascular endothelial growth factor',
  '뇌유래신경영양인자': 'brain-derived neurotrophic factor',
  '에리트로포이에틴': 'erythropoietin',
  '트롬보포이에틴': 'thrombopoietin',
  '그라눌로사이트콜로니자극인자': 'granulocyte colony-stimulating factor'
};

// 생물체 이름 매핑
const organismMapping = {
  '인간': 'Homo sapiens',
  '사람': 'Homo sapiens',
  '쥐': 'Mus musculus',
  '생쥐': 'Mus musculus',
  '대장균': 'Escherichia coli',
  '효모': 'Saccharomyces cerevisiae',
  '초파리': 'Drosophila melanogaster',
  '예쁜꼬마선충': 'Caenorhabditis elegans',
  '개': 'Canis lupus familiaris',
  '고양이': 'Felis catus',
  '소': 'Bos taurus',
  '돼지': 'Sus scrofa',
  '닭': 'Gallus gallus',
  '개구리': 'Xenopus laevis',
  '제브라피시': 'Danio rerio',
  '아프리카톱뱀': 'Naja naja',
  '말': 'Equus caballus',
  '양': 'Ovis aries',
  '염소': 'Capra hircus',
  '원숭이': 'Macaca mulatta'
};

async function translateToEnglish(text) {
  // 매핑된 단백질 이름 확인
  const mappedProtein = proteinNameMapping[text.toLowerCase()];
  if (mappedProtein) return mappedProtein;

  // 매핑된 생물체 이름 확인
  const mappedOrganism = organismMapping[text.toLowerCase()];
  if (mappedOrganism) return mappedOrganism;

  // Google Translate API를 사용하여 번역
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('번역 중 오류 발생:', error);
    return text; // 번역 실패시 원본 텍스트 반환
  }
}

async function searchPDB() {
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (!searchTerm) {
    alert('검색어를 입력해주세요.');
    return;
  }

  // 개발자 모드 키워드 감지
  if (searchTerm.toLowerCase() === 'developer mode') {
    toggleDeveloperMode();
    document.getElementById('searchInput').value = '';
    return;
  }
  
  if (searchTerm.toLowerCase() === 'kill developer mode') {
    if (isDeveloperMode) {
      toggleDeveloperMode();
    }
    document.getElementById('searchInput').value = '';
    return;
  }

  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> 검색중...</div>';

  function supportIcon(status, detail) {
    if (status === 'ok') return `<span style="color: var(--success); font-weight: 500; margin-left: 6px;">정상</span>${detail ? `<span style='color: var(--text-secondary); font-size: 0.9em; margin-left: 4px;'>${detail}</span>` : ''}`;
    if (status === 'empty') return `<span style="color: var(--warning); font-weight: 500; margin-left: 6px;">비어있음</span>`;
    if (status === 'error') return `<span style="color: var(--danger); font-weight: 500; margin-left: 6px;">서버 오류</span>`;
    return `<span style="color: var(--danger); font-weight: 500; margin-left: 6px;">미지원</span>`;
  }

  // 안내문 패턴 (영문 안내문이 포함된 경우 미지원 처리)
  const unavailablePatterns = [
    /structure not available/i,
    /not released/i,
    /not available/i,
    /not provided/i,
    /not deposited/i,
    /no structure data/i,
    /not yet released/i,
    /not currently available/i
  ];

  try {
    // PDB ID 형식인지 확인 (4자리 문자 + 숫자 조합)
    const pdbIdPattern = /^[0-9][a-z0-9]{3}$/i;
    if (pdbIdPattern.test(searchTerm)) {
      // PDB ID로 직접 검색
      const pdbResponse = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${searchTerm.toUpperCase()}`);
      if (!pdbResponse.ok) {
        throw new Error('PDB ID를 찾을 수 없습니다.');
      }
      const pdbData = await pdbResponse.json();

      // 지원 여부 확인 (실제 GET으로 100자 이상 내용 있는지 + 안내문 체크)
      const pdbUrl = `https://files.rcsb.org/download/${searchTerm.toUpperCase()}.pdb`;
      const cifUrl = `https://files.rcsb.org/download/${searchTerm.toUpperCase()}.cif`;
      async function checkFile(url) {
        try {
          const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'text/plain' } });
          if (!res.ok) return { status: 'error' };
          const text = await res.text();
          if (!text || text.length < 100) return { status: 'empty' };
          for (const pat of unavailablePatterns) {
            if (pat.test(text)) return { status: 'unavailable' };
          }
          return { status: 'ok' };
        } catch (e) {
          return { status: 'error' };
        }
      }
      const [pdbCheck, cifCheck] = await Promise.all([
        checkFile(pdbUrl),
        checkFile(cifUrl)
      ]);

      const div = document.createElement('div');
      div.className = 'result-item';

      // 단백질 정보 추출
      const title = pdbData.struct?.title || searchTerm;
      const organism = pdbData.rcsb_entity_source_organism?.[0]?.scientific_name || 'Unknown organism';
      const method = pdbData.exptl?.[0]?.method || 'Unknown method';

      div.innerHTML = `
        <div style="margin-bottom: 12px;">
          <strong style="font-size: 16px;">${title}</strong><br>
          <small style="color: var(--text-secondary);">생물체: ${organism}</small><br>
          <small style="color: var(--text-secondary);">구조 결정 방법: ${method}</small><br>
          <small style="color: var(--accent);">PDB ID: ${searchTerm.toUpperCase()}</small>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="copy-btn" onclick="copyPDBFromRCSB('${searchTerm.toUpperCase()}')" ${(pdbCheck.status !== 'ok') ? 'disabled style=\'opacity:0.5;\'' : ''}>
            <i class="fas fa-copy"></i> PDB 복사 ${supportIcon(pdbCheck.status === 'unavailable' ? '미지원' : pdbCheck.status)}
          </button>
          <button class="copy-btn" onclick="copyCIFFromRCSB('${searchTerm.toUpperCase()}')" ${(cifCheck.status !== 'ok') ? 'disabled style=\'opacity:0.5;\'' : ''}>
            <i class="fas fa-copy"></i> CIF 복사 ${supportIcon(cifCheck.status === 'unavailable' ? '미지원' : cifCheck.status)}
          </button>
        </div>
      `;
      resultsDiv.innerHTML = '';
      resultsDiv.appendChild(div);
      resultsDiv.style.display = 'block';
      return;
    }

    // 기존 UniProt 검색 로직
    const englishSearchTerm = await translateToEnglish(searchTerm);
    console.log('번역된 검색어:', englishSearchTerm);

    // UniProt API 검색
    const uniprotResponse = await fetch(`https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(englishSearchTerm)}&format=json&size=10`);
    if (!uniprotResponse.ok) {
      throw new Error('UniProt 검색에 실패했습니다.');
    }
    const uniprotData = await uniprotResponse.json();
    if (!uniprotData.results || uniprotData.results.length === 0) {
      resultsDiv.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 24px;">검색 결과가 없습니다.</div>';
      return;
    }

    resultsDiv.innerHTML = '';
    for (const entry of uniprotData.results) {
      const uniprotId = entry.primaryAccession;
      const pdbUrl = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.pdb`;
      const cifUrl = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.cif`;
      const [pdbCheck, cifCheck] = await Promise.all([
        (async () => {
          try {
            const res = await fetch(pdbUrl, { method: 'GET', headers: { 'Accept': 'text/plain' } });
            if (!res.ok) return { status: 'error' };
            const text = await res.text();
            if (!text || text.length < 100) return { status: 'empty' };
            for (const pat of unavailablePatterns) {
              if (pat.test(text)) return { status: 'unavailable' };
            }
            return { status: 'ok' };
          } catch (e) { return { status: 'error' }; }
        })(),
        (async () => {
          try {
            const res = await fetch(cifUrl, { method: 'GET', headers: { 'Accept': 'text/plain' } });
            if (!res.ok) return { status: 'error' };
            const text = await res.text();
            if (!text || text.length < 100) return { status: 'empty' };
            for (const pat of unavailablePatterns) {
              if (pat.test(text)) return { status: 'unavailable' };
            }
            return { status: 'ok' };
          } catch (e) { return { status: 'error' }; }
        })()
      ]);

      if ((pdbCheck.status === 'ok' || cifCheck.status === 'ok')) {
        const div = document.createElement('div');
        div.className = 'result-item';

        // 단백질 정보 추출
        const proteinName = entry.proteinDescription?.recommendedName?.fullName?.value || entry.primaryAccession;
        const organism = entry.organism?.scientificName || 'Unknown organism';
        const geneNames = entry.genes?.map(gene => gene.geneName?.value).filter(Boolean).join(', ') || '';
        const function_ = entry.comments?.find(comment => comment.type === 'FUNCTION')?.texts?.[0]?.value || '';

        div.innerHTML = `
          <div style="margin-bottom: 12px;">
            <strong style="font-size: 16px;">${proteinName}</strong><br>
            <small style="color: var(--text-secondary);">생물체: ${organism}</small><br>
            ${geneNames ? `<small style="color: var(--text-secondary);">유전자: ${geneNames}</small><br>` : ''}
            ${function_ ? `<small style="color: var(--text-secondary);">기능: ${function_.substring(0, 100)}${function_.length > 100 ? '...' : ''}</small><br>` : ''}
            <small style="color: var(--accent);">UniProt ID: ${uniprotId}</small>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="copy-btn" onclick="copyPDB('${uniprotId}')" ${(pdbCheck.status !== 'ok') ? 'disabled style=\'opacity:0.5;\'' : ''}>
              <i class="fas fa-copy"></i> PDB 복사 ${supportIcon(pdbCheck.status === 'unavailable' ? '미지원' : pdbCheck.status)}
            </button>
            <button class="copy-btn" onclick="copyCIF('${uniprotId}')" ${(cifCheck.status !== 'ok') ? 'disabled style=\'opacity:0.5;\'' : ''}>
              <i class="fas fa-copy"></i> CIF 복사 ${supportIcon(cifCheck.status === 'unavailable' ? '미지원' : cifCheck.status)}
            </button>
          </div>
        `;
        resultsDiv.appendChild(div);
      }
    }
    if (resultsDiv.children.length === 0) {
      resultsDiv.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 24px;">AlphaFold에서 예측된 구조를 찾을 수 없습니다.</div>';
    } else {
      resultsDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    resultsDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i> 검색 중 오류가 발생했습니다.<br>
        <small>${error.message}</small>
      </div>`;
    resultsDiv.style.display = 'block';
  }
}

async function copyPDB(uniprotId) {
  const resultsDiv = document.getElementById('searchResults');
  const originalContent = resultsDiv.innerHTML;
  try {
    resultsDiv.innerHTML = `<div class="loading">
      <i class="fas fa-spinner"></i> 구조를 가져오는 중...
    </div>`;
    const response = await fetch(`https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.pdb`, {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`AlphaFold에서 ${uniprotId}의 구조를 찾을 수 없습니다.`);
      } else if (response.status === 403) {
        throw new Error('접근이 거부되었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`서버 오류 (${response.status}): ${response.statusText}`);
      }
    }
    const pdbText = await response.text();
    if (!pdbText || pdbText.length < 100) {
      throw new Error('유효하지 않은 구조 파일입니다. 파일이 손상되었을 수 있습니다.');
    }
    try {
      await navigator.clipboard.writeText(pdbText);
    } catch (clipboardError) {
      console.error('클립보드 복사 실패:', clipboardError);
    }
    document.getElementById('pdbInput').value = pdbText;
    resultsDiv.innerHTML = `<div class="success-message">
      <i class="fas fa-check-circle"></i> 구조가 성공적으로 복사되었습니다.<br>
      <small>텍스트 영역에 자동으로 붙여넣었습니다.</small>
    </div>`;
    setTimeout(() => {
      if (window.innerWidth > 810) {
        const navBar = document.querySelector('.nav-bar');
        navBar.classList.add('nav-visible');
        setTimeout(() => navBar.classList.remove('nav-visible'), 2500);
      }
    }, 200);
    setTimeout(() => {
      resultsDiv.innerHTML = originalContent;
    }, 3000);
  } catch (error) {
    console.error('구조 복사 중 오류 발생:', error);
    resultsDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i> 오류 발생<br>
        <small>${error.message}</small><br>
        <button class="btn btn-primary" style="margin-top: 10px;" onclick="searchPDB()">
          <i class="fas fa-redo"></i> 다시 검색
        </button>
      </div>`;
  }
}

async function copyPDBFromRCSB(pdbId) {
  const resultsDiv = document.getElementById('searchResults');
  const originalContent = resultsDiv.innerHTML;
  try {
    resultsDiv.innerHTML = `<div class="loading">
      <i class="fas fa-spinner"></i> 구조를 가져오는 중...
    </div>`;
    const response = await fetch(`https://files.rcsb.org/download/${pdbId}.pdb`, {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`RCSB에서 ${pdbId}의 PDB 구조를 찾을 수 없습니다.`);
      } else if (response.status === 403) {
        throw new Error('접근이 거부되었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`서버 오류 (${response.status}): ${response.statusText}`);
      }
    }
    const pdbText = await response.text();
    if (!pdbText || pdbText.length < 100) {
      throw new Error('유효하지 않은 구조 파일입니다. 파일이 손상되었을 수 있습니다.');
    }
    try {
      await navigator.clipboard.writeText(pdbText);
    } catch (clipboardError) {
      console.error('클립보드 복사 실패:', clipboardError);
    }
    document.getElementById('pdbInput').value = pdbText;
    resultsDiv.innerHTML = `<div class="success-message">
      <i class="fas fa-check-circle"></i> PDB 구조가 성공적으로 복사되었습니다.<br>
      <small>텍스트 영역에 자동으로 붙여넣었습니다.</small>
    </div>`;
    setTimeout(() => {
      if (window.innerWidth > 810) {
        const navBar = document.querySelector('.nav-bar');
        navBar.classList.add('nav-visible');
        setTimeout(() => navBar.classList.remove('nav-visible'), 2500);
      }
    }, 200);
    setTimeout(() => {
      resultsDiv.innerHTML = originalContent;
    }, 3000);
  } catch (error) {
    console.error('PDB 구조 복사 중 오류 발생:', error);
    resultsDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i> 오류 발생<br>
        <small>${error.message}</small><br>
        <button class="btn btn-primary" style="margin-top: 10px;" onclick="searchPDB()">
          <i class="fas fa-redo"></i> 다시 검색
        </button>
      </div>`;
  }
}

async function copyCIFFromRCSB(pdbId) {
  const resultsDiv = document.getElementById('searchResults');
  const originalContent = resultsDiv.innerHTML;
  try {
    resultsDiv.innerHTML = `<div class="loading">
      <i class="fas fa-spinner"></i> 구조를 가져오는 중...
    </div>`;
    const response = await fetch(`https://files.rcsb.org/download/${pdbId}.cif`, {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`RCSB에서 ${pdbId}의 CIF 구조를 찾을 수 없습니다.`);
      } else if (response.status === 403) {
        throw new Error('접근이 거부되었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`서버 오류 (${response.status}): ${response.statusText}`);
      }
    }
    const cifText = await response.text();
    if (!cifText || cifText.length < 100) {
      throw new Error('유효하지 않은 구조 파일입니다. 파일이 손상되었을 수 있습니다.');
    }
    try {
      await navigator.clipboard.writeText(cifText);
    } catch (clipboardError) {
      console.error('클립보드 복사 실패:', clipboardError);
    }
    document.getElementById('pdbInput').value = cifText;
    resultsDiv.innerHTML = `<div class="success-message">
      <i class="fas fa-check-circle"></i> CIF 구조가 성공적으로 복사되었습니다.<br>
      <small>텍스트 영역에 자동으로 붙여넣었습니다.</small>
    </div>`;
    setTimeout(() => {
      if (window.innerWidth > 810) {
        const navBar = document.querySelector('.nav-bar');
        navBar.classList.add('nav-visible');
        setTimeout(() => navBar.classList.remove('nav-visible'), 2500);
      }
    }, 200);
    setTimeout(() => {
      resultsDiv.innerHTML = originalContent;
    }, 3000);
  } catch (error) {
    console.error('CIF 구조 복사 중 오류 발생:', error);
    resultsDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i> 오류 발생<br>
        <small>${error.message}</small><br>
        <button class="btn btn-primary" style="margin-top: 10px;" onclick="searchPDB()">
          <i class="fas fa-redo"></i> 다시 검색
        </button>
      </div>`;
  }
}

async function copyCIF(uniprotId) {
  const resultsDiv = document.getElementById('searchResults');
  const originalContent = resultsDiv.innerHTML;
  try {
    resultsDiv.innerHTML = `<div class="loading">
      <i class="fas fa-spinner"></i> 구조를 가져오는 중...
    </div>`;
    const response = await fetch(`https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.cif`, {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`AlphaFold에서 ${uniprotId}의 구조를 찾을 수 없습니다.`);
      } else if (response.status === 403) {
        throw new Error('접근이 거부되었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`서버 오류 (${response.status}): ${response.statusText}`);
      }
    }
    const cifText = await response.text();
    if (!cifText || cifText.length < 100) {
      throw new Error('유효하지 않은 구조 파일입니다. 파일이 손상되었을 수 있습니다.');
    }
    try {
      await navigator.clipboard.writeText(cifText);
    } catch (clipboardError) {
      console.error('클립보드 복사 실패:', clipboardError);
    }
    document.getElementById('pdbInput').value = cifText;
    resultsDiv.innerHTML = `<div class="success-message">
      <i class="fas fa-check-circle"></i> 구조가 성공적으로 복사되었습니다.<br>
      <small>텍스트 영역에 자동으로 붙여넣었습니다.</small>
    </div>`;
    setTimeout(() => {
      if (window.innerWidth > 810) {
        const navBar = document.querySelector('.nav-bar');
        navBar.classList.add('nav-visible');
        setTimeout(() => navBar.classList.remove('nav-visible'), 2500);
      }
    }, 200);
    setTimeout(() => {
      resultsDiv.innerHTML = originalContent;
    }, 3000);
  } catch (error) {
    console.error('구조 복사 중 오류 발생:', error);
    resultsDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i> 오류 발생<br>
        <small>${error.message}</small><br>
        <button class="btn btn-primary" style="margin-top: 10px;" onclick="searchPDB()">
          <i class="fas fa-redo"></i> 다시 검색
        </button>
      </div>`;
  }
}

// Enter 키로 검색 실행
document.getElementById('searchInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchPDB();
  }
});

window.addEventListener("resize", () => stage.handleResize());

function toggleFullscreen() {
  const viewport = document.getElementById('viewport');
  const sidepanel = document.getElementById('sidepanel');
  const fullscreenBtn = document.querySelector('.fullscreen-toggle');
  
  if (!viewport.classList.contains('fullscreen')) {
    // 전체 화면으로 전환
    viewport.classList.add('fullscreen');
    sidepanel.classList.add('hidden');
    fullscreenBtn.classList.add('fullscreen');
    fullscreenBtn.querySelector('i').classList.remove('fa-expand');
    fullscreenBtn.querySelector('i').classList.add('fa-compress');
    
    // NGL 스테이지 리사이즈
    setTimeout(() => {
      stage.handleResize();
    }, 300);
  } else {
    // 전체 화면 해제
    viewport.classList.remove('fullscreen');
    sidepanel.classList.remove('hidden');
    fullscreenBtn.classList.remove('fullscreen');
    fullscreenBtn.querySelector('i').classList.remove('fa-compress');
    fullscreenBtn.querySelector('i').classList.add('fa-expand');
    
    // NGL 스테이지 리사이즈
    setTimeout(() => {
      stage.handleResize();
    }, 300);
  }
}

// 화면 크기 변경시 네비게이션 바 상태 초기화
window.addEventListener('resize', function() {
  if (window.innerWidth > 810) {
    // Only handle fullscreen mode
    const viewport = document.getElementById('viewport');
    const sidepanel = document.getElementById('sidepanel');
    if (viewport.classList.contains('fullscreen')) {
      viewport.classList.remove('fullscreen');
      sidepanel.classList.remove('hidden');
      const fullscreenBtn = document.querySelector('.fullscreen-toggle');
      fullscreenBtn.classList.remove('fullscreen');
      fullscreenBtn.querySelector('i').classList.remove('fa-compress');
      fullscreenBtn.querySelector('i').classList.add('fa-expand');
      
      // NGL 스테이지 리사이즈
      setTimeout(() => {
        stage.handleResize();
      }, 300);
    }
  }
});

// 트리거 바와 nav-bar 연동 (데스크톱)
if (window.innerWidth > 810) {
  const triggerBar = document.getElementById('trigger-bar');
  const navBar = document.querySelector('.nav-bar');
  let navTimeout = null;
  // 트리거 바에 마우스 올리면 nav-bar 보이기
  triggerBar.addEventListener('mouseenter', () => {
    navBar.classList.add('nav-visible');
    triggerBar.style.display = 'none';
  });
  // nav-bar에서 마우스가 벗어나면 nav-bar 숨기기
  navBar.addEventListener('mouseleave', () => {
    navBar.classList.remove('nav-visible');
    triggerBar.style.display = 'block';
  });
}

// 오버레이 닫기 버튼
document.getElementById('closeHighlightOverlay').onclick = function() {
  document.getElementById('highlightOverlay').style.display = 'none';
};

// 하이라이트 오버레이 드래그 및 리사이즈 기능
function initHighlightOverlayDrag() {
  const overlay = document.getElementById('highlightOverlay');
  const corner = overlay.querySelector('.resize-handle-corner');
  let isDragging = false;
  let isResizing = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let startWidth = 0;
  let startHeight = 0;
  
  // 커서 스타일을 안전하게 변경하는 함수
  function setCursor(cursorType) {
    try {
      document.body.style.cursor = cursorType;
      // 추가로 overlay에도 적용 (fallback)
      overlay.style.cursor = cursorType;
    } catch (e) {
      console.warn('Cursor change failed:', e);
    }
  }

  // 오버레이 드래그
  overlay.addEventListener('mousedown', function(e) {
    // 닫기 버튼이나 모서리 핸들 클릭 시 드래그 방지
    if (e.target.id === 'closeHighlightOverlay' || e.target.classList.contains('resize-handle-corner')) {
      return;
    }
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = overlay.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    
    setCursor('grabbing');
    e.preventDefault();
  });

  // 모서리 리사이즈
  corner.addEventListener('mousedown', function(e) {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    
    startWidth = overlay.offsetWidth;
    startHeight = overlay.offsetHeight;
    
    setCursor('nw-resize');
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newLeft = startLeft + deltaX;
      const newTop = startTop + deltaY;
      
      // 화면 경계 내에서만 이동
      const maxLeft = window.innerWidth - overlay.offsetWidth;
      const maxTop = window.innerHeight - overlay.offsetHeight;
      
      overlay.style.left = Math.max(0, Math.min(maxLeft, newLeft)) + 'px';
      overlay.style.top = Math.max(0, Math.min(maxTop, newTop)) + 'px';
    } else if (isResizing) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newWidth = Math.max(180, Math.min(400, startWidth + deltaX));
      const newHeight = Math.max(100, Math.min(300, startHeight + deltaY));
      
      overlay.style.width = newWidth + 'px';
      overlay.style.height = newHeight + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      setCursor('move');
    } else if (isResizing) {
      isResizing = false;
      setCursor('default');
    }
  });
}

// 드래그 기능 초기화
initHighlightOverlayDrag();

// 햄버거 메뉴 동작 (옵션 메뉴)
const hamburgerMenu = document.getElementById('hamburgerMenu');
const optionMenu = document.getElementById('optionMenu');
const closeOptionMenu = document.getElementById('closeOptionMenu');

function applyMenuOptions() {
  if (!loadedStructure) return;

  // 현재 선택된 옵션 가져오기
  const style = document.querySelector('input[name="menuStyleOption"]:checked').value;
  const color = document.querySelector('input[name="menuColorOption"]:checked').value;
  const spin = document.querySelector('input[name="menuSpinOption"]:checked').value;

  // 하이라이트 representation 저장
  const highlights = loadedStructure.reprList.filter(repr => repr.name.startsWith("highlight"));
  
  // 메인 representation만 제거 (하이라이트 제외)
  loadedStructure.reprList.forEach(repr => {
    if (!repr.name.startsWith("highlight")) {
      loadedStructure.removeRepresentation(repr);
    }
  });

  // Style/Color 적용
  if (style === 'cartoon') {
    cartoonRepr = loadedStructure.addRepresentation('cartoon', { colorScheme: color, name: 'mainCartoon' });
  } else if (style === 'spacefill') {
    loadedStructure.addRepresentation('spacefill', { colorScheme: color, name: 'mainSpheres' });
    cartoonRepr = null;
  } else if (style === 'surface') {
    loadedStructure.addRepresentation('surface', { colorScheme: color, name: 'mainSurface' });
    cartoonRepr = null;
  }

  // Spin 적용
  isSpinning = spin === 'on';
  stage.setSpin(isSpinning);

  // 메인 버튼 상태 업데이트
  updateMainBtnState();
  updateToggleButtonText();
}

hamburgerMenu.onclick = () => {
  optionMenu.style.display = 'flex';
  optionMenu.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // 현재 선택된 옵션 상태로 햄버거 메뉴 옵션 동기화
  const currentStyle = cartoonRepr ? 'cartoon' : 
                      loadedStructure?.reprList.find(r => r.name === 'mainSpheres') ? 'spacefill' : 'surface';
  const currentColor = cartoonRepr?.parameters.colorScheme || 'residueindex';
  const currentSpin = stage.getSpin() ? 'on' : 'off';

  // 각 옵션에 현재 상태 적용
  document.querySelector(`input[name="menuStyleOption"][value="${currentStyle}"]`).checked = true;
  document.querySelector(`input[name="menuColorOption"][value="${currentColor}"]`).checked = true;
  document.querySelector(`input[name="menuSpinOption"][value="${currentSpin}"]`).checked = true;

  // 추가 옵션 상태 동기화
  isDarkBackground = stage.getParameters().backgroundColor === '#000000';
  labelsVisible = loadedStructure?.reprList.some(r => r.type === 'label') || false;
  // Axes 체크 시 오류 방지
  try {
    axesVisible = stage.compList.some(comp => {
      if (typeof NGL !== 'undefined' && NGL.Axes) {
        return comp instanceof NGL.Axes;
      }
      return comp && comp.constructor && comp.constructor.name === 'Axes';
    }) || (loadedStructure?.reprList.some(r => r.type === 'axes') || false);
  } catch (e) {
    axesVisible = loadedStructure?.reprList.some(r => r.type === 'axes') || false;
  }
  boxVisible = loadedStructure?.reprList.some(r => r.type === 'box') || false;

  // 토글 버튼 상태 업데이트
  updateToggleButtonState('labelToggle', labelsVisible);
  updateToggleButtonState('axesToggle', axesVisible);
  updateToggleButtonState('boxToggle', boxVisible);

  // 2차 구조 하이라이트 상태 동기화
  helixVisible = helixHighlight !== null;
  sheetVisible = sheetHighlight !== null;
  loopVisible = loopHighlight !== null;
  updateToggleButtonState('helixToggle', helixVisible);
  updateToggleButtonState('sheetToggle', sheetVisible);
  updateToggleButtonState('loopToggle', loopVisible);

  // 표면 표현 상태 동기화
  surfaceVisible = surfaceRepr !== null;
  sasVisible = sasRepr !== null;
  sasPlusVisible = sasPlusRepr !== null;
  updateToggleButtonState('surfaceToggle', surfaceVisible);
  updateToggleButtonState('sasToggle', sasVisible);
  updateToggleButtonState('sasPlusToggle', sasPlusVisible);

  // 측정 도구 상태 동기화
  try {
    if (typeof NGL !== 'undefined') {
      distanceVisible = NGL.DistanceMeasure && currentMeasureTool instanceof NGL.DistanceMeasure;
      angleVisible = NGL.AngleMeasure && currentMeasureTool instanceof NGL.AngleMeasure;
      dihedralVisible = NGL.DihedralMeasure && currentMeasureTool instanceof NGL.DihedralMeasure;
    } else {
      distanceVisible = false;
      angleVisible = false;
      dihedralVisible = false;
    }
  } catch (e) {
    distanceVisible = false;
    angleVisible = false;
    dihedralVisible = false;
  }
  updateToggleButtonState('distanceToggle', distanceVisible);
  updateToggleButtonState('angleToggle', angleVisible);
  updateToggleButtonState('dihedralToggle', dihedralVisible);
};

closeOptionMenu.onclick = () => {
  optionMenu.classList.remove('show');
  setTimeout(() => {
    optionMenu.style.display = 'none';
  }, 300);
  document.body.style.overflow = '';
};

// 옵션 변경 시 실제 구조에 반영
function syncOptionMenuToMain() {
  document.querySelectorAll('input[name="menuStyleOption"]').forEach(el => {
    el.addEventListener('change', function() {
      applyMenuOptions();
    });
  });
  document.querySelectorAll('input[name="menuColorOption"]').forEach(el => {
    el.addEventListener('change', function() {
      applyMenuOptions();
    });
  });
  document.querySelectorAll('input[name="menuSpinOption"]').forEach(el => {
    el.addEventListener('change', function() {
      applyMenuOptions();
    });
  });
}
syncOptionMenuToMain();

// 추가 시각화 옵션 함수들
function toggleBackground() {
  isDarkBackground = !isDarkBackground;
  stage.setParameters({ backgroundColor: isDarkBackground ? '#000000' : '#ffffff' });
  
  // 현재 활성화된 측정 도구가 있다면 색상 업데이트
  if (currentMeasureTool) {
    const color = isDarkBackground ? 'white' : 'black';
    currentMeasureTool.setParameters({
      color: color,
      labelColor: color
    });
  }
}

function toggleLabels() {
  labelsVisible = !labelsVisible;
  if (loadedStructure) {
    if (labelsVisible) {
      loadedStructure.addRepresentation('label', {
        sele: 'protein and .CA',
        scale: 1.2,
        color: isDarkBackground ? 'white' : 'black'
      });
    } else {
      loadedStructure.reprList.forEach(repr => {
        if (repr.type === 'label') {
          loadedStructure.removeRepresentation(repr);
        }
      });
    }
  }
  updateToggleButtonState('labelToggle', labelsVisible);
}

function toggleAxes() {
  axesVisible = !axesVisible;
  if (axesVisible) {
    // NGL.Axes가 없을 수 있으므로 대체 방법 사용
    try {
      if (typeof NGL.Axes !== 'undefined') {
    stage.addComponentFromObject(new NGL.Axes());
  } else {
        // 간단한 축 표시를 위한 대체 방법
        if (loadedStructure) {
          loadedStructure.addRepresentation('axes', {
            scale: 3
          });
        }
      }
    } catch (e) {
      console.warn('Axes toggle error:', e);
      // 축 표시를 위한 대체 방법
      if (loadedStructure) {
        loadedStructure.addRepresentation('axes', {
          scale: 3
        });
      }
    }
  } else {
    // 축 제거
    try {
    stage.compList.forEach(comp => {
        if (comp && comp.constructor && comp.constructor.name === 'Axes') {
        stage.removeComponent(comp);
      }
    });
    } catch (e) {
      // 대체 방법으로 추가한 axes representation 제거
      if (loadedStructure) {
        loadedStructure.reprList.forEach(repr => {
          if (repr.type === 'axes') {
            loadedStructure.removeRepresentation(repr);
          }
        });
      }
    }
  }
  updateToggleButtonState('axesToggle', axesVisible);
}

function toggleBox() {
  boxVisible = !boxVisible;
  if (loadedStructure) {
    if (boxVisible) {
      loadedStructure.addRepresentation('box', {
        color: isDarkBackground ? 'white' : 'black',
        opacity: 0.5
      });
    } else {
      loadedStructure.reprList.forEach(repr => {
        if (repr.type === 'box') {
          loadedStructure.removeRepresentation(repr);
        }
      });
    }
  }
  updateToggleButtonState('boxToggle', boxVisible);
}

// 토글 버튼 상태 업데이트 함수
function updateToggleButtonState(buttonId, isActive) {
  const button = document.getElementById(buttonId);
  if (isActive) {
    button.classList.add('active');
  } else {
    button.classList.remove('active');
  }
}

// 2차 구조 하이라이트 함수들
function toggleHelixHighlight() {
  helixVisible = !helixVisible;
  if (loadedStructure) {
    if (helixVisible) {
      helixHighlight = loadedStructure.addRepresentation('cartoon', {
        sele: 'helix',
        color: 'red',
        opacity: 0.8
      });
    } else {
      if (helixHighlight) {
        loadedStructure.removeRepresentation(helixHighlight);
        helixHighlight = null;
      }
    }
  }
  updateToggleButtonState('helixToggle', helixVisible);
}

function toggleSheetHighlight() {
  sheetVisible = !sheetVisible;
  if (loadedStructure) {
    if (sheetVisible) {
      sheetHighlight = loadedStructure.addRepresentation('cartoon', {
        sele: 'sheet',
        color: 'yellow',
        opacity: 0.8
      });
    } else {
      if (sheetHighlight) {
        loadedStructure.removeRepresentation(sheetHighlight);
        sheetHighlight = null;
      }
    }
  }
  updateToggleButtonState('sheetToggle', sheetVisible);
}

function toggleLoopHighlight() {
  loopVisible = !loopVisible;
  if (loadedStructure) {
    if (loopVisible) {
      loopHighlight = loadedStructure.addRepresentation('cartoon', {
        sele: 'loop',
        color: 'green',
        opacity: 0.8
      });
    } else {
      if (loopHighlight) {
        loadedStructure.removeRepresentation(loopHighlight);
        loopHighlight = null;
      }
    }
  }
  updateToggleButtonState('loopToggle', loopVisible);
}

function clearSecondaryStructure() {
  if (helixHighlight) {
    loadedStructure.removeRepresentation(helixHighlight);
    helixHighlight = null;
  }
  if (sheetHighlight) {
    loadedStructure.removeRepresentation(sheetHighlight);
    sheetHighlight = null;
  }
  if (loopHighlight) {
    loadedStructure.removeRepresentation(loopHighlight);
    loopHighlight = null;
  }
  helixVisible = false;
  sheetVisible = false;
  loopVisible = false;
  updateToggleButtonState('helixToggle', false);
  updateToggleButtonState('sheetToggle', false);
  updateToggleButtonState('loopToggle', false);
}

// 표면 표현 함수들
function toggleSurface() {
  surfaceVisible = !surfaceVisible;
  if (loadedStructure) {
    if (surfaceVisible) {
      surfaceRepr = loadedStructure.addRepresentation('surface', {
        sele: 'protein',
        opacity: 0.8,
        color: 'residueindex'
      });
    } else {
      if (surfaceRepr) {
        loadedStructure.removeRepresentation(surfaceRepr);
        surfaceRepr = null;
      }
    }
  }
  updateToggleButtonState('surfaceToggle', surfaceVisible);
}

function toggleSAS() {
  sasVisible = !sasVisible;
  if (loadedStructure) {
    if (sasVisible) {
      sasRepr = loadedStructure.addRepresentation('surface', {
        sele: 'protein',
        opacity: 0.8,
        color: 'residueindex',
        surfaceType: 'sas'
      });
    } else {
      if (sasRepr) {
        loadedStructure.removeRepresentation(sasRepr);
        sasRepr = null;
      }
    }
  }
  updateToggleButtonState('sasToggle', sasVisible);
}

function toggleSASPlus() {
  sasPlusVisible = !sasPlusVisible;
  if (loadedStructure) {
    if (sasPlusVisible) {
      sasPlusRepr = loadedStructure.addRepresentation('surface', {
        sele: 'protein',
        opacity: 0.8,
        color: 'residueindex',
        surfaceType: 'sas+'
      });
    } else {
      if (sasPlusRepr) {
        loadedStructure.removeRepresentation(sasPlusRepr);
        sasPlusRepr = null;
      }
    }
  }
  updateToggleButtonState('sasPlusToggle', sasPlusVisible);
}

function clearSurface() {
  if (surfaceRepr) {
    loadedStructure.removeRepresentation(surfaceRepr);
    surfaceRepr = null;
  }
  if (sasRepr) {
    loadedStructure.removeRepresentation(sasRepr);
    sasRepr = null;
  }
  if (sasPlusRepr) {
    loadedStructure.removeRepresentation(sasPlusRepr);
    sasPlusRepr = null;
  }
  surfaceVisible = false;
  sasVisible = false;
  sasPlusVisible = false;
  updateToggleButtonState('surfaceToggle', false);
  updateToggleButtonState('sasToggle', false);
  updateToggleButtonState('sasPlusToggle', false);
}

// 측정 도구 함수들
function clearCurrentMeasureTool() {
  if (currentMeasureTool) {
    try {
      if (currentMeasureTool.dispose) {
    currentMeasureTool.dispose();
      }
    } catch (e) {
      console.warn('Error disposing measurement tool:', e);
    }
    currentMeasureTool = null;
  }
  
  try {
  stage.mouseControls.remove('click');
  } catch (e) {
    console.warn('Error removing mouse controls:', e);
  }
  
  distanceVisible = false;
  angleVisible = false;
  dihedralVisible = false;
  updateToggleButtonState('distanceToggle', false);
  updateToggleButtonState('angleToggle', false);
  updateToggleButtonState('dihedralToggle', false);
}

function toggleDistanceMeasure() {
  if (distanceVisible) {
    clearCurrentMeasureTool();
    return;
  }

  clearCurrentMeasureTool();
  distanceVisible = true;
  
  try {
    // NGL.DistanceMeasure가 있는지 확인
    if (typeof NGL !== 'undefined' && NGL.DistanceMeasure) {
  currentMeasureTool = new NGL.DistanceMeasure(stage, {
    color: isDarkBackground ? 'white' : 'black',
    labelSize: 1.2,
    labelColor: isDarkBackground ? 'white' : 'black',
    labelUnit: 'Å'
  });

  stage.mouseControls.add('click', function(pickingProxy) {
    if (pickingProxy && pickingProxy.atom) {
      currentMeasureTool.add(pickingProxy.atom);
    }
  });
    } else {
      console.warn('NGL.DistanceMeasure not available');
      distanceVisible = false;
      alert('거리 측정 도구를 사용할 수 없습니다.');
    }
  } catch (e) {
    console.error('Distance measure error:', e);
    distanceVisible = false;
    alert('거리 측정 도구 오류가 발생했습니다.');
  }

  updateToggleButtonState('distanceToggle', distanceVisible);
}

function toggleAngleMeasure() {
  if (angleVisible) {
    clearCurrentMeasureTool();
    return;
  }

  clearCurrentMeasureTool();
  angleVisible = true;
  
  try {
    // NGL.AngleMeasure가 있는지 확인
    if (typeof NGL !== 'undefined' && NGL.AngleMeasure) {
  currentMeasureTool = new NGL.AngleMeasure(stage, {
    color: isDarkBackground ? 'white' : 'black',
    labelSize: 1.2,
    labelColor: isDarkBackground ? 'white' : 'black',
    labelUnit: '°'
  });

  stage.mouseControls.add('click', function(pickingProxy) {
    if (pickingProxy && pickingProxy.atom) {
      currentMeasureTool.add(pickingProxy.atom);
    }
  });
    } else {
      console.warn('NGL.AngleMeasure not available');
      angleVisible = false;
      alert('각도 측정 도구를 사용할 수 없습니다.');
    }
  } catch (e) {
    console.error('Angle measure error:', e);
    angleVisible = false;
    alert('각도 측정 도구 오류가 발생했습니다.');
  }

  updateToggleButtonState('angleToggle', angleVisible);
}

function toggleDihedralMeasure() {
  if (dihedralVisible) {
    clearCurrentMeasureTool();
    return;
  }

  clearCurrentMeasureTool();
  dihedralVisible = true;
  
  try {
    // NGL.DihedralMeasure가 있는지 확인
    if (typeof NGL !== 'undefined' && NGL.DihedralMeasure) {
  currentMeasureTool = new NGL.DihedralMeasure(stage, {
    color: isDarkBackground ? 'white' : 'black',
    labelSize: 1.2,
    labelColor: isDarkBackground ? 'white' : 'black',
    labelUnit: '°'
  });

  stage.mouseControls.add('click', function(pickingProxy) {
    if (pickingProxy && pickingProxy.atom) {
      currentMeasureTool.add(pickingProxy.atom);
    }
  });
    } else {
      console.warn('NGL.DihedralMeasure not available');
      dihedralVisible = false;
      alert('이면각 측정 도구를 사용할 수 없습니다.');
    }
  } catch (e) {
    console.error('Dihedral measure error:', e);
    dihedralVisible = false;
    alert('이면각 측정 도구 오류가 발생했습니다.');
  }

  updateToggleButtonState('dihedralToggle', dihedralVisible);
}

function clearMeasurements() {
  clearCurrentMeasureTool();
}
