import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { CappedSet, CappedSetFactory } from "../typechain";

// import { advanceTimeAndBlock, getLatestBlockTimestamp } from "../utils/util";

const { expect } = chai;
chai.use(solidity);

describe("CappedSet", () => {
  let cappedSet: CappedSet;
  let owner: SignerWithAddress,
    bob: SignerWithAddress,
    alice: SignerWithAddress,
    dol: SignerWithAddress,
    kate: SignerWithAddress,
    jean: SignerWithAddress;
  before(async () => {
    [owner, bob, alice, dol, kate, jean] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const CappedSet = <CappedSetFactory>(
      await ethers.getContractFactory("CappedSet")
    );
    cappedSet = await CappedSet.deploy(5);
  });

  it("normal insert-not min", async () => {
    await expect(cappedSet.functions.insert(owner.address, 0)).to.be.revertedWith(
      "NonZero"
    );
    await cappedSet.functions.insert(owner.address, 10);
    await expect(cappedSet.functions.insert(owner.address, 11)).to.be.revertedWith(
      "AlreadyExist"
    );
    await cappedSet.functions.insert(bob.address, 4);
    await cappedSet.functions.insert(alice.address, 11)
    await cappedSet.functions.insert(dol.address, 3)
    const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.insert(kate.address, 13);

    await cappedSet.functions.insert(kate.address, 13)

    const v1 = await cappedSet.functions.getValue(dol.address)
    expect(newLowestValue).to.be.equal(v1[0]);
    expect(newLowestAddress).to.be.equal(dol.address);
  });
  it("normal insert", async () => {
    await cappedSet.functions.insert(owner.address, 10);
    await cappedSet.functions.insert(bob.address, 4);
    // const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.insert(alice.address, 11);
    await cappedSet.functions.insert(alice.address, 11)
    await cappedSet.functions.insert(dol.address, 3)
    const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.insert(kate.address, 2);

    await cappedSet.functions.insert(kate.address, 2)

    const v1 = await cappedSet.functions.getValue(kate.address)
    expect(newLowestValue).to.be.equal(v1[0]);
    expect(newLowestAddress).to.be.equal(kate.address);
  });

  it("maximum count insert", async () => {
    await cappedSet.functions.insert(owner.address, 10);
    await cappedSet.functions.insert(bob.address, 4);
    await cappedSet.functions.insert(alice.address, 11)
    await cappedSet.functions.insert(dol.address, 3)
    await cappedSet.functions.insert(kate.address, 13)
    const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.insert(jean.address, 2);
    await cappedSet.functions.insert(jean.address, 2)

    const v1 = await cappedSet.functions.getValue(dol.address)
    const v2 = await cappedSet.functions.getValue(jean.address)

    expect(newLowestValue).to.be.equal(v1[0]);
    expect(0).to.be.equal(v2[0]);
    expect(newLowestAddress).to.be.equal(dol.address);
  });
  it("maximum count insert - not min", async () => {
    await cappedSet.functions.insert(owner.address, 10);
    await cappedSet.functions.insert(bob.address, 4);
    await cappedSet.functions.insert(alice.address, 11)
    await cappedSet.functions.insert(dol.address, 3)
    await cappedSet.functions.insert(kate.address, 13)
    const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.insert(jean.address, 15);
    await cappedSet.functions.insert(jean.address, 15)

    const v1 = await cappedSet.functions.getValue(bob.address)
    const v2 = await cappedSet.functions.getValue(dol.address)

    expect(newLowestValue).to.be.equal(v1[0]);
    expect(0).to.be.equal(v2[0]);
    expect(newLowestAddress).to.be.equal(bob.address);
  });
  it("update", async () => {
    await cappedSet.functions.insert(owner.address, 10);
    await cappedSet.functions.insert(bob.address, 4);
    await cappedSet.functions.insert(alice.address, 11)
    await cappedSet.functions.insert(dol.address, 3)
    await expect(cappedSet.functions.update(jean.address, 10)).to.be.revertedWith(
      "NotExist"
    );
    const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.update(bob.address, 2);
    await cappedSet.functions.update(bob.address, 2)
    const v1 = await cappedSet.functions.getValue(bob.address)
    expect(newLowestValue).to.be.equal(v1[0]);
    expect(newLowestAddress).to.be.equal(bob.address);
  });
  it("update-not min", async () => {
    await cappedSet.functions.insert(owner.address, 10);
    await cappedSet.functions.insert(bob.address, 4);
    await cappedSet.functions.insert(alice.address, 11)
    await cappedSet.functions.insert(dol.address, 3)
    await expect(cappedSet.functions.update(jean.address, 10)).to.be.revertedWith(
      "NotExist"
    );
    const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.update(bob.address, 5);
    await cappedSet.functions.update(bob.address, 5)
    const v1 = await cappedSet.functions.getValue(dol.address)
    expect(newLowestValue).to.be.equal(v1[0]);
    expect(newLowestAddress).to.be.equal(dol.address);
  });
  it("remove-not min", async () => {
    await cappedSet.functions.insert(owner.address, 10);
    await cappedSet.functions.insert(bob.address, 4);
    await cappedSet.functions.insert(alice.address, 11)
    await cappedSet.functions.insert(dol.address, 3)
    await expect(cappedSet.functions.remove(jean.address)).to.be.revertedWith(
      "NotExist"
    );
    const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.remove(owner.address);
    await cappedSet.functions.remove(owner.address)
    const v1 = await cappedSet.functions.getValue(dol.address)
    const v2 = await cappedSet.functions.getValue(owner.address)

    expect(newLowestValue).to.be.equal(v1[0]);
    expect(0).to.be.equal(v2[0]);
    expect(newLowestAddress).to.be.equal(dol.address);
  });
  it("remove-min", async () => {
    await cappedSet.functions.insert(owner.address, 10);
    await cappedSet.functions.insert(bob.address, 4);
    await cappedSet.functions.insert(alice.address, 11)
    await cappedSet.functions.insert(dol.address, 3)
    await expect(cappedSet.functions.remove(jean.address)).to.be.revertedWith(
      "NotExist"
    );
    const { newLowestAddress, newLowestValue } = await cappedSet.callStatic.remove(dol.address);
    await cappedSet.functions.remove(dol.address)
    const v1 = await cappedSet.functions.getValue(bob.address)
    const v2 = await cappedSet.functions.getValue(dol.address)

    expect(newLowestValue).to.be.equal(v1[0]);
    expect(0).to.be.equal(v2[0]);
    expect(newLowestAddress).to.be.equal(bob.address);
  });
  it("get value", async () => {
    await cappedSet.functions.insert(owner.address, 10);
    await cappedSet.functions.insert(bob.address, 4);
    await cappedSet.functions.insert(alice.address, 11)
    const v1 = await cappedSet.functions.getValue(bob.address)

    expect(v1[0].toNumber()).to.be.equal(4);
  });
});
