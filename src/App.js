
import './App.css';
import React, { useState, useEffect } from "react";
import { connectToBrowserProvider, swap } from './script'

function App() {
  const [userAddress, setuserAddress] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const values = Object.fromEntries(data.entries());
    const { destinationToken, sourceToken, sourceAmount, stakingId } = values;

    console.log({ values })
    // unstakeAndRescue(address, privateKey, safeAddress, stakingId)

    swap(destinationToken, sourceToken, sourceAmount, userAddress)
  }

  const connectWallet = async () => {
    let userAddress = await connectToBrowserProvider()
    if (userAddress) setuserAddress(userAddress)
  }

  useEffect(async () => {
    let userAddress = await connectToBrowserProvider()
    if (userAddress) setuserAddress(userAddress)
  }, []);



  return (
    <div className="App">
      <div className="container mt-5">
        <div className="row  ml-auto mr-auto mb-4">
          <div className="col-md-12">
            <button onClick={connectWallet} className="btn btn-secondary"> {userAddress ? `connected! ${userAddress}` : 'Connect wallet'}</button>
          </div>
        </div>
        <div className="row ml-auto mr-auto">
          <form className='m-auto' onSubmit={handleSubmit}>
            {/* <div className="form-group d-flex mb-4">
            </div> */}
            <div className="form-group d-flex mb-4">
              <div className="col-md-2">
                <label >Source Token Address:</label>
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" required="true" name="sourceToken" placeholder="Enter address" />

              </div>
            </div>
            <div className="form-group d-flex mb-4">
              <div className="col-md-2">
                <label >Destination Token Address:</label>
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" required="true" name="destinationToken" aria-describedby="emailHelp" placeholder="Enter address" />
              </div>
            </div>
            <div className="form-group d-flex mb-4">
              <div className="col-md-2">
                <label>Source Amount:</label>
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" required="true" name="sourceAmount" placeholder="Enter amount" />

              </div>
            </div>

            <button type="submit" className="btn btn-primary">Swap</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
