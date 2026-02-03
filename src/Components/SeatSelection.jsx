import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SeatSelection = ({ flight, passengers, onSeatSelection, onSkip }) => {
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [currentPassenger, setCurrentPassenger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seatPreference, setSeatPreference] = useState("window");

  const generateSeatMap = (aircraftType, rows, seatsPerRow) => {
    const seatMap = {
      aircraftType,
      totalRows: rows,
      seatsPerRow,
      configuration: seatsPerRow === 4 ? "2-2" : seatsPerRow === 6 ? "2-2-2" : "3-3-3",
      seats: {}
    };

    const seatLetters = seatsPerRow === 4 ? ["A", "B", "C", "D"] : 
                       seatsPerRow === 6 ? ["A", "B", "C", "D", "E", "F"] : 
                       ["A", "B", "C", "D", "E", "F", "G", "H", "J"];

    for (let row = 1; row <= rows; row++) {
      seatLetters.forEach(letter => {
        const seatId = `${row}${letter}`;
        const isWindow = ["A", "F", "J"].includes(letter);
        const isAisle = ["C", "D", "G", "H"].includes(letter);
        
        seatMap.seats[seatId] = {
          seatId,
          row,
          letter,
          type: isWindow ? "window" : isAisle ? "aisle" : "middle",
          status: Math.random() > 0.7 ? "occupied" : "available",
          price: isWindow || isAisle ? 40 : 25,
          features: [
            ...(isWindow ? ["Window View"] : []),
            ...(isAisle ? ["Aisle Access"] : []),
            "Standard Seat"
          ]
        };
      });
    }

    return seatMap;
  };

  const getSeatMapForAircraft = (aircraftName) => {
    const aircraftLower = aircraftName.toLowerCase();
    
    if (aircraftLower.includes("boeing 787") || aircraftLower.includes("b787")) {
      return generateSeatMap("Boeing 787", 28, 6);
    }
    if (aircraftLower.includes("boeing 777") || aircraftLower.includes("b777")) {
      return generateSeatMap("Boeing 777", 32, 6);
    }
    if (aircraftLower.includes("boeing 737") || aircraftLower.includes("b737")) {
      return generateSeatMap("Boeing 737", 25, 4);
    }
    if (aircraftLower.includes("airbus a380") || aircraftLower.includes("a380")) {
      return generateSeatMap("Airbus A380", 40, 6);
    }
    if (aircraftLower.includes("airbus a350") || aircraftLower.includes("a350")) {
      return generateSeatMap("Airbus A350", 30, 6);
    }
    if (aircraftLower.includes("airbus a330") || aircraftLower.includes("a330")) {
      return generateSeatMap("Airbus A330", 28, 6);
    }
    if (aircraftLower.includes("airbus a320") || aircraftLower.includes("a320")) {
      return generateSeatMap("Airbus A320", 24, 4);
    }
    
    return generateSeatMap("Boeing 737", 25, 4);
  };

  useEffect(() => {
    loadSeatMap();
  }, [flight]);

  const loadSeatMap = async () => {
    try {
      setLoading(true);
      const aircraftSeatMap = getSeatMapForAircraft(flight.aircraft);
      setSeatMap(aircraftSeatMap);
    } catch (error) {
      console.error("Error loading seat map:", error);
      toast.error("Failed to load seat map");
    } finally {
      setLoading(false);
    }
  };

  const getSeatTypeMessage = (seatType) => {
    switch (seatType) {
      case "window":
        return " WINDOW SEAT\n Enjoy beautiful aerial views!\n Perfect for photography and sightseeing\n Great for resting against the wall";
      case "aisle":
        return " AISLE SEAT\n Easy access to walkway\n Quick access to restroom\n More legroom and freedom to move";
      case "middle":
        return " MIDDLE SEAT\n Between window and aisle passengers\n Most affordable option\n Great for traveling with companions";
      default:
        return " Standard seat with basic amenities";
    }
  };

  const handleSeatClick = (seatId, seat) => {
    if (seat.status !== "available") {
      toast.warning("This seat is not available");
      return;
    }

    const passenger = passengers[currentPassenger];
    
    // Show alert with seat type information
    const seatTypeMessage = getSeatTypeMessage(seat.type);
    alert(` Seat Selected: ${seatId}\n\n${seatTypeMessage}\n\nPrice: ?${seat.price}\nPassenger: ${passenger.firstName} ${passenger.lastName}`);
    
    const newSelectedSeats = { ...selectedSeats };
    Object.keys(newSelectedSeats).forEach(key => {
      if (newSelectedSeats[key].passengerId === passenger.id) {
        delete newSelectedSeats[key];
      }
    });

    newSelectedSeats[seatId] = {
      passengerId: passenger.id,
      passengerName: `${passenger.firstName} ${passenger.lastName}`,
      seatDetails: seat,
      price: seat.price
    };

    setSelectedSeats(newSelectedSeats);
    
    if (currentPassenger < passengers.length - 1) {
      setTimeout(() => {
        setCurrentPassenger(currentPassenger + 1);
      }, 500);
    }
  };

  const getSeatColor = (seatId, seat) => {
    if (selectedSeats[seatId]) return "#c8e6c9";
    if (seat.status === "occupied") return "#ffcdd2";
    if (seat.type === "window") return "#e3f2fd";
    if (seat.type === "aisle") return "#f3e5f5";
    return "#f5f5f5";
  };

  const getSeatIcon = (seat) => {
    if (seat.type === "window") return "";
    if (seat.type === "aisle") return "";
    return "";
  };

  const getTotalPrice = () => {
    return Object.values(selectedSeats).reduce((total, selection) => total + selection.price, 0);
  };

  const handleConfirmSelection = () => {
    const selections = Object.entries(selectedSeats).map(([seatId, selection]) => ({
      seatId,
      seatNumber: seatId,
      seatType: selection.seatDetails.type,
      price: selection.price,
      passengerName: selection.passengerName,
      features: selection.seatDetails.features
    }));

    onSeatSelection(selections, getTotalPrice());
  };

  const autoSelectSeats = () => {
    if (!seatMap || !seatMap.seats) {
      toast.error("Seat map not loaded");
      return;
    }

    const availableSeats = Object.entries(seatMap.seats)
      .filter(([_, seat]) => seat.status === "available")
      .sort((a, b) => {
        if (seatPreference === "window") {
          if (a[1].type === "window" && b[1].type !== "window") return -1;
          if (b[1].type === "window" && a[1].type !== "window") return 1;
        } else if (seatPreference === "aisle") {
          if (a[1].type === "aisle" && b[1].type !== "aisle") return -1;
          if (b[1].type === "aisle" && a[1].type !== "aisle") return 1;
        }
        return a[1].row - b[1].row;
      });

    const newSelectedSeats = {};
    passengers.forEach((passenger, index) => {
      if (availableSeats[index]) {
        const [seatId, seat] = availableSeats[index];
        newSelectedSeats[seatId] = {
          passengerId: passenger.id,
          passengerName: `${passenger.firstName} ${passenger.lastName}`,
          seatDetails: seat,
          price: seat.price
        };
      }
    });

    setSelectedSeats(newSelectedSeats);
    
    // Show alert for auto-selected seats
    const selectedSeatTypes = Object.entries(newSelectedSeats).map(([seatId, selection]) => 
      `${seatId}: ${selection.seatDetails.type.toUpperCase()}`
    ).join("\n");
    
    alert(` Auto-Selected ${seatPreference.toUpperCase()} Seats!\n\n${selectedSeatTypes}\n\nTotal: ?${Object.values(newSelectedSeats).reduce((sum, s) => sum + s.price, 0)}`);
    
    toast.success(`Auto-selected ${seatPreference} seats for all passengers!`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" />
        <h4>Loading Seat Map...</h4>
      </div>
    );
  }

  if (!seatMap) {
    return (
      <div className="text-center py-5">
        <h4>Seat map not available for {flight.aircraft}</h4>
        <button className="btn btn-primary mt-3" onClick={onSkip}>
          Continue Without Seat Selection
        </button>
      </div>
    );
  }

  return (
    <div className="seat-selection-container">
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-white rounded-4 shadow-lg p-4">
            <h3 className="fw-bold mb-3"> Select Your Seats</h3>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Flight:</strong> {flight.from}  {flight.to}</p>
                <p><strong>Aircraft:</strong> {flight.aircraft}</p>
                <p><strong>Configuration:</strong> {seatMap.configuration}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Passengers:</strong> {passengers.length}</p>
                <p><strong>Current:</strong> {passengers[currentPassenger]?.firstName} {passengers[currentPassenger]?.lastName}</p>
                <p><strong>Selected:</strong> {Object.keys(selectedSeats).length}/{passengers.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-white rounded-4 shadow-lg p-4">
            <div className="row align-items-center">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Seat Preference:</label>
                <select 
                  className="form-select"
                  value={seatPreference}
                  onChange={(e) => setSeatPreference(e.target.value)}
                >
                  <option value="window"> Window Seats</option>
                  <option value="aisle"> Aisle Seats</option>
                  <option value="any"> Any Available</option>
                </select>
              </div>
              <div className="col-md-4">
                <button 
                  className="btn btn-success w-100"
                  onClick={autoSelectSeats}
                >
                   Auto-Select Seats
                </button>
              </div>
              <div className="col-md-4">
                <div className="text-end">
                  <div className="fw-bold">Total Seat Fees:</div>
                  <div className="fs-4 text-success">?{getTotalPrice().toLocaleString("en-IN")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-white rounded-4 shadow-lg p-3">
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              <div className="d-flex align-items-center">
                <div style={{ backgroundColor: "#e3f2fd", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", marginRight: "8px" }}></div>
                <span>Window</span>
              </div>
              <div className="d-flex align-items-center">
                <div style={{ backgroundColor: "#f3e5f5", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", marginRight: "8px" }}></div>
                <span>Aisle</span>
              </div>
              <div className="d-flex align-items-center">
                <div style={{ backgroundColor: "#f5f5f5", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", marginRight: "8px" }}></div>
                <span>Middle</span>
              </div>
              <div className="d-flex align-items-center">
                <div style={{ backgroundColor: "#c8e6c9", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", marginRight: "8px" }}></div>
                <span>Selected</span>
              </div>
              <div className="d-flex align-items-center">
                <div style={{ backgroundColor: "#ffcdd2", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", marginRight: "8px" }}></div>
                <span>Occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-white rounded-4 shadow-lg p-4">
            <div className="text-center mb-3">
              <h5> {flight.aircraft} Seat Map</h5>
              <p className="text-muted">Click on any available seat to see detailed information!</p>
            </div>
            
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {Object.entries(seatMap.seats).slice(0, 60).map(([seatId, seat]) => {
                const isSelected = selectedSeats[seatId];
                
                return (
                  <button
                    key={seatId}
                    className={`btn btn-sm ${isSelected ? "btn-success" : seat.status === "occupied" ? "btn-danger" : "btn-outline-primary"}`}
                    style={{
                      width: "45px",
                      height: "45px",
                      margin: "2px",
                      fontSize: "12px",
                      backgroundColor: getSeatColor(seatId, seat),
                      border: isSelected ? "2px solid #4caf50" : "1px solid #ddd"
                    }}
                    onClick={() => handleSeatClick(seatId, seat)}
                    disabled={seat.status === "occupied"}
                    title={`${seatId} - ${seat.type} - ?${seat.price}`}
                  >
                    <div>{isSelected ? "" : getSeatIcon(seat)}</div>
                    <div style={{ fontSize: "10px" }}>{seatId}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {Object.keys(selectedSeats).length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-success bg-opacity-10 rounded-4 shadow-lg p-4">
              <h5 className="fw-bold text-success mb-3">Selected Seats</h5>
              <div className="row">
                {Object.entries(selectedSeats).map(([seatId, selection]) => (
                  <div key={seatId} className="col-md-6 mb-3">
                    <div className="bg-white rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{selection.passengerName}</div>
                          <div className="text-muted">Seat {seatId} - {selection.seatDetails.type.toUpperCase()}</div>
                          <div className="small text-success">{getSeatIcon(selection.seatDetails)} {selection.seatDetails.type === "window" ? "Window View" : selection.seatDetails.type === "aisle" ? "Aisle Access" : "Middle Seat"}</div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success">?{selection.price}</div>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              const newSelected = { ...selectedSeats };
                              delete newSelected[seatId];
                              setSelectedSeats(newSelected);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="bg-white rounded-4 shadow-lg p-4">
            <div className="d-flex justify-content-between">
              <button 
                className="btn btn-outline-secondary"
                onClick={onSkip}
              >
                Skip Seat Selection
              </button>
              
              <button 
                className="btn btn-success btn-lg"
                onClick={handleConfirmSelection}
                disabled={Object.keys(selectedSeats).length !== passengers.length}
              >
                Confirm Seats (?{getTotalPrice().toLocaleString("en-IN")})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;





