import DataElement from "./data-element";
import SignatureReference from "./signature-reference";
import SignatureDigestMethod from "./signature-digest-method";
import SignatureDigestValue from "./signature-digest-value";
import SignatureCanonicalizationMethod from "./signature-canonicalization-method";

// The SignatureValue element contains the actual value of the digital signature; it is always encoded using base64
// https://www.w3.org/TR/xmldsig-core1/#sec-SignatureValue
/*
<element name="SignatureValue" type="ds:SignatureValueType" /> 

<complexType name="SignatureValueType">
  <simpleContent>
    <extension base="base64Binary">
      <attribute name="Id" type="ID" use="optional"/>
    </extension>
  </simpleContent>
</complexType>
*/

export default class SignatureValue extends DataElement {
  constructor(value, id) {
    // value should be base64
    super("signatureValue", value, { id: id });
  }
}
