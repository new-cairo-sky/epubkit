import DataElement from "./data-element";
import SignatureReference from "./signature-reference";
import SignatureSignatureMethod from "./signature-signature-method";
import SignatureCanonicalizationMethod from "./signature-canonicalization-method";

// https://www.w3.org/TR/xmldsig-core1/#sec-SignedInfo
/*
<element name="SignedInfo" type="ds:SignedInfoType"/> 
<complexType name="SignedInfoType">
  <sequence> 
    <element ref="ds:CanonicalizationMethod"/>
    <element ref="ds:SignatureMethod"/> 
    <element ref="ds:Reference" maxOccurs="unbounded"/> 
  </sequence>  
  <attribute name="Id" type="ID" use="optional"/> 
</complexType>
*/
export default class SignatureSignedInfo extends DataElement {
  constructor(id) {
    super("SignedInfo", undefined, { id: id });

    this.canonicalizationMethod = new SignatureCanonicalizationMethod();
    this.signatureMethod = new SignatureSignatureMethod();
    this.reference = [];
  }

  addReference(uri, transforms, digestMethod, digestValue) {
    this.reference.push(
      new SignatureReference(uri, transforms, digestMethod, digestValue)
    );
  }
}
